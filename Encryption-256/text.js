let message = "This is just a confidencial message.";
console.log("Message: "+message);
let utf = [];
for(i=0;i<message.length;i++){
	utf.push(message.charCodeAt(i));
}
console.log("Encoded: "+utf);
let decode = new String();
for(let i=0;i<utf.length;i++){
	decode += String.fromCharCode(utf[i]+1);
}
console.log("Decoded: "+decode);
