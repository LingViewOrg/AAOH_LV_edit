module apb_led_ctl(

	input rst,
	
	//apb bus signals
	input clk,

	input [31:0] paddr,
	input psel,
	input penable,
	input pwrite,
	output pready,
	output pslverr,
	input  [31:0] pwdata,
	output [31:0] prdata,

	//led output signals
	output [7:0] led,
	output [2:0] rgbA,
	output [2:0] rgbB
);

//insantiate modules here


endmodule

module led_ctl(
	input clk,
	input rst,

	input [1:0] addr,
	input [7:0] write_data,
	output [7:0] read_data,
	input write_en,


	output [7:0] led,
	output [2:0] rgbA,
	output [2:0] rgbB
);

	reg [7:0] led_data;
	reg [2:0] rgbA_data;
	reg [2:0] rgbB_data;

	assign led = led_data;
	assign rgbA = rgbA_data;
	assign rgbB = rgbB_data;


endmodule
	always @(posedge clk)
	begin
		//write decoding for leds
		if(rst)
			led_data<=8'd0;
		else if(write_en & (addr==2'd0) )
			led_data<=write_data;

		//write decoding for rgbA
		if(rst)
			rgbA_data<=2'd0;
		else if(write_en & (addr==2'd1) )
			rgbA_data<=write_data[2:0];

		//write decoding for rgbB
		if(rst)
			rgbB_data<=2'd0;
		else if(write_en & (addr==2'd2) )
			rgbB_data<=write_data[2:0];
	end
	reg [7:0] in_rdata;
	assign read_data = in_rdata;

	always @(*)
	begin
		case(addr)
			0:
				in_rdata= led_data;
			1:
				in_rdata = {5'd0,rgbA_data};
			2:
				in_rdata = {5'd0,rgbB_data };
			3:
				in_rdata = 8'd0;
		endcase
	end


    module apb_led_ctl(

	input rst,

	//apb bus signals
	input clk,
	input [31:0] paddr,
	input psel,
	input penable,
	input pwrite,
	output pready,
	output pslverr,
	input  [31:0] pwdata,
	output [31:0] prdata,

	//led output signals
	output [7:0] led,
	output [2:0] rgbA,
	output [2:0] rgbB
);

	wire write_en;
	wire [1:0] addr;

	//IMPORTANT, make sure you don't use bits [1:0]
	assign addr = paddr[3:2];
	assign write_en = (psel & penable & pwrite);

	assign pready=1'b1;
	assign pslverr=1'b0;




	led_ctl led_inst(
		.clk(clk),
		.rst(rst),
		.addr(addr),
		.write_data(pwdata[7:0]),
		.read_data(prdata[7:0]),
		.write_en(write_en),

		.led(led),
		.rgbA(rgbA),
		.rgbB(rgbB)
	);

	//make sure remaining data bits are driven
	assign prdata[31:8]=0;



endmodule

