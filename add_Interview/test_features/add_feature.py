#!/usr/bin/env python3
"""
AddFeatures.py

Adds features to existing .eaf file. 

Need the interviews elan file and annotated csv file with features

"""

import csv
import difflib
import os
import re
import tkinter as tk
from tkinter import filedialog, messagebox

try:
    import pympi
except ImportError:
    pympi = None

def clean_string(text):
    if text is None:
        return ""
    no_punct = re.sub(r"[^\w\s]", "", text)
    return re.sub(r"\s+", " ", no_punct).strip().lower()


def containment_score(csv_text, eaf_text):
    csv_words = set(clean_string(csv_text).split())
    eaf_words = set(clean_string(eaf_text).split())
    if not csv_words:
        return 0.0
    return len(csv_words & eaf_words) / len(csv_words)


def strings_match(csv_text, eaf_text, threshold=0.8):
    if containment_score(csv_text, eaf_text) >= threshold:
        return True

    ratio = difflib.SequenceMatcher(
        None, clean_string(csv_text), clean_string(eaf_text)
    ).ratio()
    return ratio >= 0.55


def get_delimiter(sample):
    first_line = sample.splitlines()[0] if sample else ""
    return ";" if first_line.count(";") > first_line.count(",") else ","


def load_feature_rows(csv_path):
    with open(csv_path, "r", encoding="utf-8-sig", newline="") as f:
        sample = f.read(4096)
        f.seek(0)
        delimiter = get_delimiter(sample)
        rows = list(csv.reader(f, delimiter=delimiter))

    if not rows:
        return []

    header = [h.strip() for h in rows[0]]

    try:
        text_col = header.index("Text")
    except ValueError:
        raise ValueError(
            "CSV is missing a 'Text' column. "
            "Expected headers like: Speaker, Text, Null copula, ..."
        )

    feature_rows = []
    for row in rows[1:]:
        if len(row) <= text_col:
            continue
        sentence = row[text_col].strip()
        if not sentence:
            continue

        for col_idx, cell in enumerate(row):
            if col_idx == text_col:
                continue
            if cell.strip() != "1":
                continue
            if col_idx >= len(header) or not header[col_idx]:
                continue
            feature_rows.append((sentence, header[col_idx]))

    return feature_rows


def get_all_annotations(eaf):
    out = []
    for tier_id in eaf.get_tier_names():
        if tier_id == "Features":
            continue
        for annotation in eaf.get_annotation_data_for_tier(tier_id):
            start, end, text = annotation[0], annotation[1], annotation[2]
            if text and text.strip():
                out.append((tier_id, start, end, text))
    return out


def add_features(eaf_path, csv_path, match_threshold=0.7, verbose=True):
    if pympi is None:
        raise RuntimeError(
            "pympi is required. Please install in terminal with pip install pympi-ling"
        )

    feature_rows = load_feature_rows(csv_path)
    if not feature_rows:
        if verbose:
            print("No feature rows found in CSV")
        return 0

    if verbose:
        print(f"Loaded {len(feature_rows)} feature rows from {csv_path}")

    eaf = pympi.Elan.Eaf(eaf_path)

    if "Features" in eaf.get_tier_names():
        if verbose:
            print("Removing existing Features.")
        eaf.remove_tier("Features")

    eaf.add_tier("Features")

    annotations = get_all_annotations(eaf)

    added = 0
    seen = set() 

    for sentence, label in feature_rows:
        best_match = None
        best_score = 0.0

        for _tier_id, start, end, text in annotations:
            if not strings_match(sentence, text, match_threshold):
                continue
            score = containment_score(sentence, text)
            if score > best_score:
                best_score = score
                best_match = (start, end)

        if best_match is None:
            if verbose:
                print(f"  [no match] {label}: {sentence[:60]}...")
            continue

        start, end = best_match
        key = (start, end, label)
        if key in seen:
            continue
        seen.add(key)

        eaf.add_annotation("Features", start, end, f"AAOH Feature: {label}")
        added += 1

        if verbose:
            print(
                f"  [match] {label} @ {start}-{end}ms "
                f"(score {best_score:.2f}) :: {sentence[:60]}..."
            )

    eaf.to_file(eaf_path)
    if verbose:
        print(f"Wrote {added} feature annotations to {eaf_path}")

    return added

def pick_file():
    path = filedialog.askopenfilename(
        title="Select an ELAN .eaf file",
        filetypes=[("ELAN files", "*.eaf"), ("All files", "*.*")],
    )
    if path:
        entry.delete(0, tk.END)
        entry.insert(0, path)


def run_script():
    eaf_path = entry.get().strip()
    if not eaf_path:
        messagebox.showerror("Error", "Please select an .eaf file first.")
        return
    if not os.path.isfile(eaf_path):
        messagebox.showerror("Error", f"File not found:\n{eaf_path}")
        return
    if not eaf_path.lower().endswith(".eaf"):
        messagebox.showerror("Error", "Selected file is not a .eaf file.")
        return

    csv_path = eaf_path[:-4] + "ufdc_complete.csv"
    if not os.path.isfile(csv_path):
        csv_path = eaf_path[:-4] + "ufdc.csv"
        if not os.path.isfile(csv_path):
            csv_path = eaf_path[:-4] + ".csv"
            if not os.path.isfile(csv_path):
                messagebox.showerror(
                    "Error",
                    f"No matching CSV found.\nExpected:\n{csv_path}\n\n"
                    "The CSV must have the same base name as the .eaf file.",
                )
                return

    try:
        added = add_features(eaf_path, csv_path, verbose=True)
    except Exception as exc:
        messagebox.showerror("Error", f"Something went wrong:\n\n{exc}")
        return

    if added == 0:
        messagebox.showwarning(
            "No annotations added",
            "The tool ran but found no matching sentences.\n\n"
            "Check that the CSV text matches the .eaf transcript.",
        )
    else:
        messagebox.showinfo(
            "Done",
            f"Added {added} feature annotation(s).\n\n"
            f"Updated: {os.path.basename(eaf_path)}",
        )


if __name__ == "__main__":
    root = tk.Tk()
    root.title("Add Features to ELAN")
    root.geometry("620x250")
    root.config(bg="lightblue")

    tk.Label(
        root,
        text="Select an .eaf file. A matching .csv must sit beside it.",
        bg="lightblue",
    ).pack(pady=(15, 5))

    entry = tk.Entry(root, width=65)
    entry.pack(pady=5)

    tk.Button(root, text="Browse", command=pick_file).pack(pady=5)

    tk.Button(
        root, text="Add Features", command=run_script, width=15
    ).pack(pady=10)

    root.mainloop()