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

void InvByteSub(ustring& state){
	for(int i=0;i<16;i++){
		state[i] = invSbox[state[i]];
	}
}

ustring InvShiftRows(ustring& state){
	ustring result;
	// 1st Column
	result += state[0];
	result += state[13];
	result += state[10];
	result += state[7];

	// 2nd Column
	result += state[4];
	result += state[1];
	result += state[14];
	result += state[11];

	// 3rd Column
	result += state[8];
	result += state[5];
	result += state[2];
	result += state[15];

	// 4rt Column
	result += state[12];
	result += state[9];
	result += state[6];
	result += state[3];

	return result;
}

ustring InvMixCol(ustring& state){
	ustring tmp;
	tmp += (unsigned char)mul14[state[0]] ^ mul11[state[1]] ^ mul13[state[2]] ^ mul9[state[3]];
	tmp += (unsigned char)mul9[state[0]] ^ mul14[state[1]] ^ mul11[state[2]] ^ mul13[state[3]];
	tmp += (unsigned char)mul13[state[0]] ^ mul9[state[1]] ^ mul14[state[2]] ^ mul11[state[3]];
	tmp += (unsigned char)mul11[state[0]] ^ mul13[state[1]] ^ mul9[state[2]] ^ mul14[state[3]];

	tmp += (unsigned char)mul14[state[4]] ^ mul11[state[5]] ^ mul13[state[6]] ^ mul9[state[7]];
	tmp += (unsigned char)mul9[state[4]] ^ mul14[state[5]] ^ mul11[state[6]] ^ mul13[state[7]];
	tmp += (unsigned char)mul13[state[4]] ^ mul9[state[5]] ^ mul14[state[6]] ^ mul11[state[7]];
	tmp += (unsigned char)mul11[state[4]] ^ mul13[state[5]] ^ mul9[state[6]] ^ mul14[state[7]];

	tmp += (unsigned char)mul14[state[8]] ^ mul11[state[9]] ^ mul13[state[10]] ^ mul9[state[11]];
	tmp += (unsigned char)mul9[state[8]] ^ mul14[state[9]] ^ mul11[state[10]] ^ mul13[state[11]];
	tmp += (unsigned char)mul13[state[8]] ^ mul9[state[9]] ^ mul14[state[10]] ^ mul11[state[11]];
	tmp += (unsigned char)mul11[state[8]] ^ mul13[state[9]] ^ mul9[state[10]] ^ mul14[state[11]];

	tmp += (unsigned char)mul14[state[12]] ^ mul11[state[13]] ^ mul13[state[14]] ^ mul9[state[15]];
	tmp += (unsigned char)mul9[state[12]] ^ mul14[state[13]] ^ mul11[state[14]] ^ mul13[state[15]];
	tmp += (unsigned char)mul13[state[12]] ^ mul9[state[13]] ^ mul14[state[14]] ^ mul11[state[15]];
	tmp += (unsigned char)mul11[state[12]] ^ mul13[state[13]] ^ mul9[state[14]] ^ mul14[state[15]];

	return tmp;
}

void InvRound(ustring& state, ustring& key, int begin){
	AddKey(state, key, begin);
	state = InvMixCol(state);
	state = InvShiftRows(state);
	InvByteSub(state);
}
void InvFirstRound(ustring& state, ustring& key, int begin){
	AddKey(state, key, begin);
	state = InvShiftRows(state);
	InvByteSub(state);
}

ustring AESDecrypt(ustring& cipher, ustring& keys){
	ustring message = cipher;
	int numRounds = 13;
	InvFirstRound(message, keys, 224);
	// InvFirstRound(message, keys, 218);

	// Rounds 2 - 14
	for(int i=numRounds-1;i>=0;i--){
		InvRound(message, keys, 16*(i+1));
	}
	AddKey(message, keys, 0);
	return message;
}

int main(){
	ustring message, cipher;
	cout<<"Enter hex codes of cipher: ";
	string input;
	getline(cin, input);
	stringstream cipherToChar(input);
	unsigned int c;
	for(int i=0;cipherToChar>>hex>>c;i++){
		cipher += c;
	}
	string hexkey;
	cout<<"Enter Key in Hex: ";
	getline(cin, hexkey);
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
	for(int i=0;i<cipher.size();i+=16){
		ustring state = cipher.substr(i, 16);
		message += AESDecrypt(state, subKeys);
	}
	cout<<"Hex code of Decrypted Message:\n"<<hex;
	for(int i=0;i<message.size();i++){
		cout<<(int)message[i]<<" ";
	}cout<<endl;
	cout<<"Decrypted Message:\n";
	for(int i=0;i<message.size();i++){
		cout<<message[i];
	}cout<<endl;
	return 0;
}
