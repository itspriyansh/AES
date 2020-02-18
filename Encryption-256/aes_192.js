const tables = require('./tables');

AddKey = (obj, begin) => {
	let text = new String();
	for(let i=0;i<16;i++){
		text += String.fromCharCode(obj.text.charCodeAt(i) ^ obj.key.charCodeAt(begin+i));
	}
	obj.text = text;
};

ByteSub = (obj) => {
	let text = new String();
	for(let i=0;i<16;i++){
		text += String.fromCharCode(tables.sbox[obj.text.charCodeAt(i)]);
	}
	obj.text = text;
};

ShiftRows = (obj) => {
	let result = new String();
	// 1st Column
	result += obj.text[0];
	result += obj.text[5];
	result += obj.text[10];
	result += obj.text[15];

	// 2nd Column
	result += obj.text[4];
	result += obj.text[9];
	result += obj.text[14];
	result += obj.text[3];

	// 3rd Column
	result += obj.text[8];
	result += obj.text[13];
	result += obj.text[2];
	result += obj.text[7];

	// 4rt Column
	result += obj.text[12];
	result += obj.text[1];
	result += obj.text[6];
	result += obj.text[11];

	return result;
};

MixCol = (obj) => {
	let tmp = new String();
	tmp += String.fromCharCode(tables.mul2[obj.text.charCodeAt(0)] ^ tables.mul3[obj.text.charCodeAt(1)] ^ obj.text.charCodeAt(2) ^ obj.text.charCodeAt(3));
	tmp += String.fromCharCode(obj.text.charCodeAt(0) ^ tables.mul2[obj.text.charCodeAt(1)] ^ tables.mul3[obj.text.charCodeAt(2)] ^ obj.text.charCodeAt(3));
	tmp += String.fromCharCode(obj.text.charCodeAt(0) ^ obj.text.charCodeAt(1) ^ tables.mul2[obj.text.charCodeAt(2)] ^ tables.mul3[obj.text.charCodeAt(3)]);
	tmp += String.fromCharCode(tables.mul3[obj.text.charCodeAt(0)] ^ obj.text.charCodeAt(1) ^ obj.text.charCodeAt(2) ^ tables.mul2[obj.text.charCodeAt(3)]);

	tmp += String.fromCharCode(tables.mul2[obj.text.charCodeAt(4)] ^ tables.mul3[obj.text.charCodeAt(5)] ^ obj.text.charCodeAt(6) ^ obj.text.charCodeAt(7));
	tmp += String.fromCharCode(obj.text.charCodeAt(4) ^ tables.mul2[obj.text.charCodeAt(5)] ^ tables.mul3[obj.text.charCodeAt(6)] ^ obj.text.charCodeAt(7));
	tmp += String.fromCharCode(obj.text.charCodeAt(4) ^ obj.text.charCodeAt(5) ^ tables.mul2[obj.text.charCodeAt(6)] ^ tables.mul3[obj.text.charCodeAt(7)]);
	tmp += String.fromCharCode(tables.mul3[obj.text.charCodeAt(4)] ^ obj.text.charCodeAt(5) ^ obj.text.charCodeAt(6) ^ tables.mul2[obj.text.charCodeAt(7)]);

	tmp += String.fromCharCode(tables.mul2[obj.text.charCodeAt(8)] ^ tables.mul3[obj.text.charCodeAt(9)] ^ obj.text.charCodeAt(10) ^ obj.text.charCodeAt(11));
	tmp += String.fromCharCode(obj.text.charCodeAt(8) ^ tables.mul2[obj.text.charCodeAt(9)] ^ tables.mul3[obj.text.charCodeAt(10)] ^ obj.text.charCodeAt(11));
	tmp += String.fromCharCode(obj.text.charCodeAt(8) ^ obj.text.charCodeAt(9) ^ tables.mul2[obj.text.charCodeAt(10)] ^ tables.mul3[obj.text.charCodeAt(11)]);
	tmp += String.fromCharCode(tables.mul3[obj.text.charCodeAt(8)] ^ obj.text.charCodeAt(9) ^ obj.text.charCodeAt(10) ^ tables.mul2[obj.text.charCodeAt(11)]);

	tmp += String.fromCharCode(tables.mul2[obj.text.charCodeAt(12)] ^ tables.mul3[obj.text.charCodeAt(13)] ^ obj.text.charCodeAt(14) ^ obj.text.charCodeAt(15));
	tmp += String.fromCharCode(obj.text.charCodeAt(12) ^ tables.mul2[obj.text.charCodeAt(13)] ^ tables.mul3[obj.text.charCodeAt(14)] ^ obj.text.charCodeAt(15));
	tmp += String.fromCharCode(obj.text.charCodeAt(12) ^ obj.text.charCodeAt(13) ^ tables.mul2[obj.text.charCodeAt(14)] ^ tables.mul3[obj.text.charCodeAt(15)]);
	tmp += String.fromCharCode(tables.mul3[obj.text.charCodeAt(12)] ^ obj.text.charCodeAt(13) ^ obj.text.charCodeAt(14) ^ tables.mul2[obj.text.charCodeAt(15)]);

	return tmp;
};

Round = (obj, begin) => {
	ByteSub(obj);
	obj.text = ShiftRows(obj);
	obj.text = MixCol(obj);
	AddKey(obj, begin);
};

FinalRound = (obj, begin) => {
	ByteSub(obj);
	obj.text = ShiftRows(obj);
	AddKey(obj, begin);
};

AESEncrypt = (obj) => {
	let numRounds = 11;
	AddKey(obj, 0);
	// Rounds 1-9
	for(let i=0;i<numRounds;i++){
		Round(obj, 16*(i+1));
	}
	FinalRound(obj, 192);
	return obj.text;
};

InvByteSub = (obj) => {
	let text = new String();
	for(let i=0;i<16;i++){
		text += String.fromCharCode(tables.invSbox[obj.text.charCodeAt(i)]);
	}
	obj.text = text;
};

InvShiftRows = (obj) => {
	let result = new String();
	result += obj.text[0];
	result += obj.text[13];
	result += obj.text[10];
	result += obj.text[7];

	// 2nd Column
	result += obj.text[4];
	result += obj.text[1];
	result += obj.text[14];
	result += obj.text[11];

	// 3rd Column
	result += obj.text[8];
	result += obj.text[5];
	result += obj.text[2];
	result += obj.text[15];

	// 4rt Column
	result += obj.text[12];
	result += obj.text[9];
	result += obj.text[6];
	result += obj.text[3];

	return result;
};

InvMixCol = (obj) => {
	let tmp = new String();
	tmp += String.fromCharCode(tables.mul14[obj.text.charCodeAt(0)] ^ tables.mul11[obj.text.charCodeAt(1)] ^ tables.mul13[obj.text.charCodeAt(2)] ^ tables.mul9[obj.text.charCodeAt(3)]);
	tmp += String.fromCharCode(tables.mul9[obj.text.charCodeAt(0)] ^ tables.mul14[obj.text.charCodeAt(1)] ^ tables.mul11[obj.text.charCodeAt(2)] ^ tables.mul13[obj.text.charCodeAt(3)]);
	tmp += String.fromCharCode(tables.mul13[obj.text.charCodeAt(0)] ^ tables.mul9[obj.text.charCodeAt(1)] ^ tables.mul14[obj.text.charCodeAt(2)] ^ tables.mul11[obj.text.charCodeAt(3)]);
	tmp += String.fromCharCode(tables.mul11[obj.text.charCodeAt(0)] ^ tables.mul13[obj.text.charCodeAt(1)] ^ tables.mul9[obj.text.charCodeAt(2)] ^ tables.mul14[obj.text.charCodeAt(3)]);

	tmp += String.fromCharCode(tables.mul14[obj.text.charCodeAt(4)] ^ tables.mul11[obj.text.charCodeAt(5)] ^ tables.mul13[obj.text.charCodeAt(6)] ^ tables.mul9[obj.text.charCodeAt(7)]);
	tmp += String.fromCharCode(tables.mul9[obj.text.charCodeAt(4)] ^ tables.mul14[obj.text.charCodeAt(5)] ^ tables.mul11[obj.text.charCodeAt(6)] ^ tables.mul13[obj.text.charCodeAt(7)]);
	tmp += String.fromCharCode(tables.mul13[obj.text.charCodeAt(4)] ^ tables.mul9[obj.text.charCodeAt(5)] ^ tables.mul14[obj.text.charCodeAt(6)] ^ tables.mul11[obj.text.charCodeAt(7)]);
	tmp += String.fromCharCode(tables.mul11[obj.text.charCodeAt(4)] ^ tables.mul13[obj.text.charCodeAt(5)] ^ tables.mul9[obj.text.charCodeAt(6)] ^ tables.mul14[obj.text.charCodeAt(7)]);

	tmp += String.fromCharCode(tables.mul14[obj.text.charCodeAt(8)] ^ tables.mul11[obj.text.charCodeAt(9)] ^ tables.mul13[obj.text.charCodeAt(10)] ^ tables.mul9[obj.text.charCodeAt(11)]);
	tmp += String.fromCharCode(tables.mul9[obj.text.charCodeAt(8)] ^ tables.mul14[obj.text.charCodeAt(9)] ^ tables.mul11[obj.text.charCodeAt(10)] ^ tables.mul13[obj.text.charCodeAt(11)]);
	tmp += String.fromCharCode(tables.mul13[obj.text.charCodeAt(8)] ^ tables.mul9[obj.text.charCodeAt(9)] ^ tables.mul14[obj.text.charCodeAt(10)] ^ tables.mul11[obj.text.charCodeAt(11)]);
	tmp += String.fromCharCode(tables.mul11[obj.text.charCodeAt(8)] ^ tables.mul13[obj.text.charCodeAt(9)] ^ tables.mul9[obj.text.charCodeAt(10)] ^ tables.mul14[obj.text.charCodeAt(11)]);

	tmp += String.fromCharCode(tables.mul14[obj.text.charCodeAt(12)] ^ tables.mul11[obj.text.charCodeAt(13)] ^ tables.mul13[obj.text.charCodeAt(14)] ^ tables.mul9[obj.text.charCodeAt(15)]);
	tmp += String.fromCharCode(tables.mul9[obj.text.charCodeAt(12)] ^ tables.mul14[obj.text.charCodeAt(13)] ^ tables.mul11[obj.text.charCodeAt(14)] ^ tables.mul13[obj.text.charCodeAt(15)]);
	tmp += String.fromCharCode(tables.mul13[obj.text.charCodeAt(12)] ^ tables.mul9[obj.text.charCodeAt(13)] ^ tables.mul14[obj.text.charCodeAt(14)] ^ tables.mul11[obj.text.charCodeAt(15)]);
	tmp += String.fromCharCode(tables.mul11[obj.text.charCodeAt(12)] ^ tables.mul13[obj.text.charCodeAt(13)] ^ tables.mul9[obj.text.charCodeAt(14)] ^ tables.mul14[obj.text.charCodeAt(15)]);

	return tmp;
};

InvRound = (obj, begin) => {
	AddKey(obj, begin);
	obj.text = InvMixCol(obj);
	obj.text = InvShiftRows(obj);
	InvByteSub(obj);
};

InvFirstRound = (obj, begin) => {
	AddKey(obj, begin);
	obj.text = InvShiftRows(obj);
	InvByteSub(obj);
};

AESDecrypt = (obj) => {
	let numRounds = 11;
	InvFirstRound(obj, 192);
	// Rounds 2-10
	for(let i=numRounds-1;i>=0;i--){
		InvRound(obj, 16*(i+1));
	}
	AddKey(obj, 0);
	return obj.text;
};

exports.EncryptMain = (obj) => {
	let count = 0;
	while(obj.text.length%16 != 0){
		obj.text += String.fromCharCode(0);
		count++;
	}
	let subKeys = tables.KeyWhitening_192(obj.key);
	let cipher = new String();
	let context = {key: subKeys};
	for(let i=0;i<obj.text.length;i+=16){
		context.text = obj.text.slice(i, i+16);
		cipher += AESEncrypt(context);
	}
	cipher += String.fromCharCode(count);
	return cipher;
};

exports.DecryptMain = (obj) => {
	let count = obj.text.charCodeAt(obj.text.length-1);
	obj.text = obj.text.slice(0, -1);
	let subKeys = tables.KeyWhitening_192(obj.key);
	let data = new String();
	let context = {key: subKeys};
	for(let i=0;i<obj.text.length;i+=16){
		context.text = obj.text.slice(i, i+16);
		data += AESDecrypt(context);
	}
	if(count>0) data = data.slice(0, -1*count);
	return data;
};