module.exports =  function caesarCipher(cipher, number) {

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    
    const num = alphabet.length - number
    
    const alphabetRot = alphabet.slice(num) + alphabet.slice(0, num);
    
    let text = '';
    
    for (let i in cipher){
    
        if (alphabet.includes(cipher[i].toLowerCase())) {
            text += alphabetRot.charAt(alphabet.indexOf(cipher[i]))           
        } else {
            text += cipher[i]
        }
    
    }
    
    return text
}