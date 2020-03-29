const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const sha1 = require('js-sha1')
const caesarCipher = require('./caesarCipher')

const httpGet = 'https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=f631e201542cf1c8caecfe4f7c18f26ca64049ec'
const httpPost = 'https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=f631e201542cf1c8caecfe4f7c18f26ca64049ec'

const path = 'answer.json'

const file = new Promise((resolve, reject) => {
    axios.get(httpGet).then(response => {
        fs.writeFile(path, JSON.stringify(response.data), err => {
            if(err) reject(console.log(err))
            resolve(console.log('saved'))
        })
    }).catch(err => {
        reject(console.log(err))
    })
})

const request = new Promise((resolve, reject) => {

    let form = new FormData()

    form.append('answer', fs.createReadStream(__dirname + '/' + path), {
        contentType: 'multipart/form-data',
        filename: 'answer.json',
    })
    
    axios({
        method: 'post',
        url: httpPost,
        data: form,
        headers: form.getHeaders()
    })
        .then(response => {
            resolve(console.log(response))
        })
        .catch(err => {
            reject(console.log(err))
        })
})

file.then(() => {
    fs.readFile(path, 'utf-8', (err, data) => {
        const jsonData = JSON.parse(data)
        const numero_casas = jsonData.numero_casas
        const token = jsonData.token
        const cifrado = jsonData.cifrado
        const decifrado = caesarCipher(cifrado, numero_casas)
        const resumo_criptografico = sha1(decifrado)
        const answer = JSON.stringify({ numero_casas, token, cifrado, decifrado, resumo_criptografico })
        fs.open(path, 'w', (err, fd) => {
            fs.write(fd, answer, err => {
                if (err)
                    console.log(err)
                fs.close(fd, () => {
                    console.log('wrote the file successfully')
                })
            })
        })
    })  

})

request.then(() => {})

 



