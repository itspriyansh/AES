const AES = require('./aes_256');

let message = new String("Waa koi na, Bye!");

console.log("Message is: "+message.length+"\n"+message);

let keyArray = [19, 225, 66, 217, 104, 245, 23, 79, 31, 174, 160, 103, 163, 104, 184, 51, 84, 178, 178, 214, 53, 156, 95, 246, 206, 35, 152, 156, 62, 133, 179, 81];
let key = new String();
for(let i=0;i<32;i++){
	key += String.fromCharCode(keyArray[i]);
}

console.log("Your Key is: "+key.length+"\n"+key);

let obj = {text: message, key: key};
let cipher = AES.EncryptMain(obj);

console.log("Encrypted Message: "+cipher.length+"\n"+cipher);

obj.text = cipher;
let decrypt = AES.DecryptMain(obj);

console.log("Decrypted Message: "+decrypt.length+"\n"+decrypt);