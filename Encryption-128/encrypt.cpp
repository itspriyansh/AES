#include <iostream>
#include <cstring>
#include <sstream>
#include "tables.h"

using namespace std;
typedef basic_string<unsigned char> ustring;

void AddKey(ustring& state, ustring& key, int begin){
	for(int i=0;i<16;i++){
		state[i] ^= key[begin+i];
	}
}

void ByteSub(ustring& state){
	cout<<hex;
	unsigned char t;
	for(int i=0;i<16;i++){
		state[i] = sbox[state[i]];
	}
}

ustring ShiftRows(ustring& state){
	ustring result;
	// 1st Column
	result += state[0];
	result += state[5];
	result += state[10];
	result += state[15];

	// 2nd Column
	result += state[4];
	result += state[9];
	result += state[14];
	result += state[3];

	// 3rd Column
	result += state[8];
	result += state[13];
	result += state[2];
	result += state[7];

	// 4rt Column
	result += state[12];
	result += state[1];
	result += state[6];
	result += state[11];

	return result;
}

ustring MixCol(ustring& state){
	ustring tmp;
	tmp += (unsigned char) mul2[state[0]] ^ mul3[state[1]] ^ state[2] ^ state[3];
	tmp += (unsigned char) state[0] ^ mul2[state[1]] ^ mul3[state[2]] ^ state[3];
	tmp += (unsigned char) state[0] ^ state[1] ^ mul2[state[2]] ^ mul3[state[3]];
	tmp += (unsigned char) mul3[state[0]] ^ state[1] ^ state[2] ^ mul2[state[3]];

	tmp += (unsigned char)mul2[state[4]] ^ mul3[state[5]] ^ state[6] ^ state[7];
	tmp += (unsigned char)state[4] ^ mul2[state[5]] ^ mul3[state[6]] ^ state[7];
	tmp += (unsigned char)state[4] ^ state[5] ^ mul2[state[6]] ^ mul3[state[7]];
	tmp += (unsigned char)mul3[state[4]] ^ state[5] ^ state[6] ^ mul2[state[7]];

	tmp += (unsigned char)mul2[state[8]] ^ mul3[state[9]] ^ state[10] ^ state[11];
	tmp += (unsigned char)state[8] ^ mul2[state[9]] ^ mul3[state[10]] ^ state[11];
	tmp += (unsigned char)state[8] ^ state[9] ^ mul2[state[10]] ^ mul3[state[11]];
	tmp += (unsigned char)mul3[state[8]] ^ state[9] ^ state[10] ^ mul2[state[11]];

	tmp += (unsigned char)mul2[state[12]] ^ mul3[state[13]] ^ state[14] ^ state[15];
	tmp += (unsigned char)state[12] ^ mul2[state[13]] ^ mul3[state[14]] ^ state[15];
	tmp += (unsigned char)state[12] ^ state[13] ^ mul2[state[14]] ^ mul3[state[15]];
	tmp += (unsigned char)mul3[state[12]] ^ state[13] ^ state[14] ^ mul2[state[15]];

	return tmp;
}

void Round(ustring& state, ustring& key, int begin){
	ByteSub(state);
	state = ShiftRows(state);
	state = MixCol(state);
	AddKey(state, key, begin);
}
void FinalRound(ustring& state, ustring& key, int begin){
	ByteSub(state);
	state = ShiftRows(state);
	AddKey(state, key, begin);
}

ustring AESEncrypt(ustring& message, ustring& keys){
	ustring state = message;
	// int numRounds = 13;
	int numRounds = 9;
	AddKey(state, keys, 0);
	// Rounds 1 - 13
	for(int i=0;i<numRounds;i++){
		Round(state, keys, 16*(i+1));
	}
	// FinalRound(state, keys, 234);
	FinalRound(state, keys, 160);
	return state;
}

int main(){
	ustring message, cipher;
	string input;
	cout<<"Enter message to encrypt: ";
	// getline(cin, message);
	getline(cin, input);
	for(int i=0;i<input.size();i++){
		message += (unsigned char)input[i];
	}
	while(message.size()%16 != 0){
		message += (char)0;
	}
	for(int i=0;i<message.size();i++){
		cout<<message[i];
	}cout<<endl;
	cout<<"Hex code of message:\n"<<hex;
	for(int i=0;i<message.size();i++){
		cout<<(int)message[i]<<" ";
	}cout<<endl;

	string hexkey = "01 04 02 03 01 03 04 0A 09 0B 07 0F 0F 06 03 00";
	ustring key;
	stringstream hexToChars(hexkey);
	unsigned int k;
	int i=0;
	cout<<dec;
	cout<<"Your key is:\n";
	while(hexToChars >> hex >> k){
		cout<<k<<" ";
		key += k;
	}
	cout<<endl;
	ustring subKeys = KeyWhitening(key);
	for(int i=0;i<message.size();i+=16){
		ustring state = message.substr(i, 16);
		cipher += AESEncrypt(state, subKeys);
	}
	cout<<"Cipher Text of message:\n";
	for(int i=0;i<cipher.size();i++){
		cout<<hex<<(int)cipher[i]<<" ";
	}cout<<endl;
	return 0;
}
