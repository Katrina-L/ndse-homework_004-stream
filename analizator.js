#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const readline = require('node:readline/promises');
const {stdin, stdout} = require('node:process');

const logFile = path.join("logFile.txt");
const outputFile = path.join("output.txt");

async function game(filename) {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    let result = undefined;

    do {
        const guessingNumber = Math.round(Math.random()) + 1;
        console.log('Загадано число (1 или 2)');
        answer = await rl.question('Ваш вариант?    ');
        if ( answer === 'q' ) {
            analizator (filename);
            console.log('Вы вышли. Результаты: ');
            break;
        }
        if ( Number(answer) === guessingNumber ) {
            result = 'Верно!\n';
            fs.appendFile(filename, result, (err) => {
                if (err) throw Error (err);
            });
            console.log('Верно!');
        } else {
            result = 'Неверно!\n';
            fs.appendFile(filename, result, (err) => {
                if (err) throw Error (err);
            })
            console.log('Неверно!');
        }
    } while (answer !== 'q');
    rl.close();
}

function analizator (filename) {
    let readStr = fs.createReadStream(filename);

    let data = '';
    readStr
    .setEncoding('utf-8')
    .on('data', (chunk) => {
        data += chunk;
    })
    .on('end', () => {
        data = data.split('\n');
        resultPositive = data.filter( item => item === 'Верно!' );
        resultNegative = data.filter( item => item === 'Неверно!' );

        fs.appendFile(outputFile, 
                      `\n*******\nОбщее количество партий: ${data.length - 1}\nКолличество выйгранных партий: ${resultPositive.length}\nКолличество проигранных партий: ${resultNegative.length}\nПроцент выйгрышных партий: ${ Math.round(resultPositive.length / (data.length - 1) * 100) } %\n`, 
                      (err) => {
                        if (err) throw Error(err)}
        );
        
        console.log(`
             Общее количество партий: ${data.length - 1}
             Колличество выйгранных партий: ${resultPositive.length}
             Колличество проигранных партий: ${resultNegative.length}
             Процент выйгрышных партий: ${ Math.round(resultPositive.length / (data.length - 1) * 100) } %`
        );

        fs.unlink(filename, (err) => {
            if (err) throw Error (err);
        });
    })
}

game(logFile);
