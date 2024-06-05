#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const readline = require('node:readline/promises');
const {stdin, stdout} = require('node:process');

const logFile = path.join("logFile.txt");
const rl = readline.createInterface({ input: stdin, output: stdout });

async function game(filename) {
    let result = undefined;
        
    do {
        const guessingNumber = Math.round(Math.random()) + 1;
        console.log('Загадано число (1 или 2)');
        answer = await rl.question('Ваш вариант?    ');
        if ( answer === 'q' ) {
            console.log('Выход');
            fs.unlink(filename, (err) => {
                if (err) throw Error (err);
            });
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

game(logFile);