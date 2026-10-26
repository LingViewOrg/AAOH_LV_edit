"""Add an ELAN Features tier from AAOH CSV flags."""
import csv
import re
import sys
import xml.etree.ElementTree as ET
from collections import defaultdict
from pathlib import Path

FEATURE_HEADERS = [
    "Null copula",
    "Person/num. agreement",
    "Multiple negators",
    "Existential it/dey",
    "Perfect done",
    "Remote past BIN",
    "Habitual be",
]

SKIP_TIERS = {"features", "default"}
SPEAKER_PREFIX = re.compile(r"^[A-Za-z]{1,8}:\s*")
NON_WORD = re.compile(r"[^\w\s]")
WHITESPACE = re.compile(r"\s+")
FEATURES_TIER_RE = re.compile(
    r'\n[ \t]*<TIER\b[^>]*TIER_ID="Features"[^>]*>.*?</TIER>',
    re.DOTALL,
)

PAIRS = [
    (
        "data/csv_files/AAHP 024 David Richardson 5-27-2010.csv",
        "data/elan_files/AAHP 024 David Richardson 5-27-2010.eaf",
    ),
    (
        "data/csv_files/AAHP 173A Cornelius Clayton Jr 5-12-2011.csv",
        "data/elan_files/AAHP_173A_Cornelius_Clayton_Jr_5-12-2011.eaf",
    ),
    (
        "data/csv_files/AAHP 173B Cornelius Clayton 9-9-2011.csv",
        "data/elan_files/AAHP173BCorneliusClayton9-9-2011.eaf",
    ),
    (
        "data/csv_files/AAHP 176 Nkwanda Jah 5-31-2011.csv",
        "data/elan_files/AAHP_176_Nkwanda_Jah_5-31-2011.eaf",
    ),
    (
        "data/csv_files/AAHP 180 Alethia Brown 08-10-2011.csv",
        "data/elan_files/AAHP_180_Alethia_Brown_8-10-2011.eaf",
    ),
    (
        "data/csv_files/AAHP 209 Barbara Sharpe 11-8-2011.csv",
        "data/elan_files/AAHP_209_Barbara_Sharpe_11-8-2011.eaf",
    ),
    (
        "data/csv_files/AAHP 620 John Bonaparte 9-21-18.csv",
        "data/elan_files/AAHP-620-John-Bonaparte-9-21-2018.eaf",
    ),
    (
        "data/csv_files/AAHP 621 Emily Williams 9-21-2018.csv",
        "data/elan_files/AAHP 621 Emily Williams 9-21-2018.eaf",
    ),
    (
        "data/csv_files/MFP 142 Breyanna Hooper 9-21-2013.csv",
        "data/elan_files/MFP_142_Breyanna_Hooper_9-21-2013.eaf",
    ),
]


def normalize_header(name):
    return WHITESPACE.sub(" ", (name or "").replace("\ufeff", "").strip())


def tokens(text):
    text = SPEAKER_PREFIX.sub("", text or "")
    text = NON_WORD.sub(" ", text.lower())
    return [t for t in WHITESPACE.sub(" ", text).strip().split(" ") if t]


def header_map(fieldnames):
    mapping = {}
    for raw in fieldnames or []:
        key = normalize_header(raw)
        mapping[key.lower()] = raw
    return mapping


def csv_text_and_features(row, fields):
    headers = header_map(fields)
    text_key = headers.get("text")
    speaker_key = headers.get("speaker")
    text = (row.get(text_key) or "").strip() if text_key else ""
    if speaker_key and text:
        speaker = (row.get(speaker_key) or "").strip()
        if speaker and text.lower().startswith(speaker.lower()):
            text = text[len(speaker) :].lstrip(" :")
    if not text:
        text = (row.get(fields[0]) or "").strip()

    features = []
    for feature in FEATURE_HEADERS:
        raw_key = headers.get(feature.lower())
        if not raw_key:
            continue
        value = (row.get(raw_key) or "").strip()
        if value == "1":
            features.append(feature)
    return text, features


def is_good_match(csv_toks, eaf_toks, coverage):
    n = len(csv_toks)
    if n == 0 or not eaf_toks:
        return False
    density = len(set(csv_toks) & set(eaf_toks)) / max(len(set(eaf_toks)), 1)
    if n <= 3:
        return coverage >= 0.99 and density >= 0.35
    if n <= 8:
        return coverage >= 0.8
    return coverage >= 0.6


def coverage_score(csv_toks, eaf_toks):
    if not csv_toks or not eaf_toks:
        return 0.0, 0
    inter = len(set(csv_toks) & set(eaf_toks))
    return inter / len(set(csv_toks)), inter

def load_feature_rows(csv_path):
    rows = []
    with open(csv_path, newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            text, features = csv_text_and_features(row, reader.fieldnames)
            if features:
                rows.append((text, features))
    return rows
def local_tag(elem):
    return elem.tag.split("}")[-1]

def collect_eaf_utterances(root):
    times = {}
    for slot in root.iter():
        if local_tag(slot) != "TIME_SLOT":
            continue
        times[slot.attrib["TIME_SLOT_ID"]] = int(slot.attrib["TIME_VALUE"])

    utterances = []
    max_ann = 0
    ling_type = "default-lt"
    for tier in root.iter():
        if local_tag(tier) != "TIER":
            continue
        tier_id = tier.attrib.get("TIER_ID", "")
        if "LINGUISTIC_TYPE_REF" in tier.attrib and tier_id.strip().lower() not in SKIP_TIERS:
            ling_type = tier.attrib["LINGUISTIC_TYPE_REF"]
        for elem in tier.iter():
            if local_tag(elem) == "ALIGNABLE_ANNOTATION":
                ann_id = elem.attrib.get("ANNOTATION_ID", "")
                match = re.match(r"a(\d+)$", ann_id)
                if match:
                    max_ann = max(max_ann, int(match.group(1)))
        
        if tier_id.strip().lower() in SKIP_TIERS:
            continue
        
        for ann in list(tier):
            if local_tag(ann) != "ANNOTATION":
                continue
            align = None
            for child in ann:
                if local_tag(child) == "ALIGNABLE_ANNOTATION":
                    align = child
                    break
            if align is None:
                continue
            value = ""
            for child in align:
                if local_tag(child) == "ANNOTATION_VALUE" and child.text:
                    value = child.text.strip()
            if not value:
                continue
            ts1 = align.attrib["TIME_SLOT_REF1"]
            ts2 = align.attrib["TIME_SLOT_REF2"]
            utterances.append(
                {
                    "ts1": ts1,
                    "ts2": ts2,
                    "start": times[ts1],
                    "end": times[ts2],
                    "text": value,
                    "toks": tokens(value),
                }
            )
    return utterances, max_ann, ling_type


def best_utterance(csv_toks, utterances):
    best = None
    best_key = None
    for utt in utterances:
        coverage, inter = coverage_score(csv_toks, utt["toks"])
        if not is_good_match(csv_toks, utt["toks"], coverage):
            continue
        density = inter / max(len(set(utt["toks"])), 1)
        key = (coverage, density, inter)
        if best_key is None or key > best_key:
            best = utt
            best_key = key
    return best


def xml_escape(text):
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def build_features_tier(ling_type, grouped, next_id):
    lines = [
        f'    <TIER LINGUISTIC_TYPE_REF="{ling_type}" PARTICIPANT="Features" TIER_ID="Features">'
    ]
    for (_start, _end, ts1, ts2), feature_names in grouped:
        label = "AAOH Feature: " + "; ".join(feature_names)
        lines.extend(
            [
                "        <ANNOTATION>",
                f'            <ALIGNABLE_ANNOTATION ANNOTATION_ID="a{next_id}"',
                f'                TIME_SLOT_REF1="{ts1}" TIME_SLOT_REF2="{ts2}">',
                f"                <ANNOTATION_VALUE>{xml_escape(label)}</ANNOTATION_VALUE>",
                "            </ALIGNABLE_ANNOTATION>",
                "        </ANNOTATION>",
            ]
        )
        next_id += 1
    lines.append("    </TIER>")
    return "\n".join(lines) + "\n", next_id - 1

def insert_features_tier(xml_text, tier_xml, last_id):
    xml_text = FEATURES_TIER_RE.sub("", xml_text)
    xml_text = re.sub(
        r'(<PROPERTY NAME="lastUsedAnnotationId">)\d+(</PROPERTY>)',
        rf"\g<1>{last_id}\2",
        xml_text,
        count=1,
    )
    match = re.search(r"\n[ \t]*<LINGUISTIC_TYPE\b", xml_text)
    if not match:
        raise RuntimeError("Could not find LINGUISTIC_TYPE insertion point")
    return xml_text[: match.start()] + "\n" + tier_xml + xml_text[match.start() + 1 :]


def process_pair(root, csv_rel, eaf_rel, write):
    csv_path = root / csv_rel
    eaf_path = root / eaf_rel
    feature_rows = load_feature_rows(csv_path)
    xml_text = eaf_path.read_text(encoding="utf-8")
    tree_root = ET.fromstring(xml_text)
    utterances, max_ann, ling_type = collect_eaf_utterances(tree_root)


    grouped = {}
    unmatched = []
    for text, features in feature_rows:
        utt = best_utterance(tokens(text), utterances)
        if utt is None:
            unmatched.append((text, features))
            continue
        key = (utt["start"], utt["end"], utt["ts1"], utt["ts2"])
        names = grouped.setdefault(key, [])
        for feature in features:
            if feature not in names:
                names.append(feature)

    ordered = sorted(grouped.items(), key=lambda item: (item[0][0], item[0][1]))
    print(f"\n{eaf_path.name}")
    print(f"  CSV flagged lines: {len(feature_rows)}")
    print(f"  Matched timespans: {len(grouped)}")
    print(f"  Matched timespans: {len(ordered)}")
    print(f"  Unmatched flagged lines: {len(unmatched)}")
    if unmatched:
        for text, features in unmatched[:8]:
            preview = WHITESPACE.sub(" ", text)[:110]
            print(f"    - {features}: {preview}")
        if len(unmatched) > 8:
            print(f"    ... {len(unmatched) - 8} more")

    if write:
        tier_xml, last_id = build_features_tier(ling_type, ordered, max_ann + 1)
        updated = insert_features_tier(xml_text, tier_xml, last_id)
        eaf_path.write_text(updated, encoding="utf-8")
        print(f"  Wrote {len(ordered)} Features annotations")
    return len(unmatched)


def main():
    write = "--dry-run" not in sys.argv
    root = Path(__file__).resolve().parents[1]
    unmatched_total = 0
    for csv_rel, eaf_rel in PAIRS:
        unmatched_total += process_pair(root, csv_rel, eaf_rel, write)
    print(f"\nTotal unmatched flagged lines: {unmatched_total}")
    if not write:
        print("Dry run only; no EAF files were changed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
