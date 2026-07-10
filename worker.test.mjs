import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('./worker.js', import.meta.url), 'utf8');
const workerUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const worker = (await import(workerUrl)).default;
const html = await (await worker.fetch(new Request('https://test.local'))).text();
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const clientScript = scripts.at(-1)[1].replace(/\n        renderHistory\(\);[\s\S]*$/, '');
const context = vm.createContext({ crypto: webcrypto, Uint32Array });
vm.runInContext(clientScript, context);

test('EDU 用户名与邮箱共享 5-6 位字母前缀', () => {
    context.used = new Set();
    for (let i = 0; i < 1000; i++) {
        const { email, username } = vm.runInContext('genEduAccount(used)', context);
        const localPart = email.split('@')[0];
        assert.match(username, /^[uvwxyz][a-z]{4,5}$/);
        assert.equal(localPart.slice(0, username.length), username);
        assert.match(localPart.slice(username.length), /^[012356789]+$/);
        assert.equal(localPart.length, 13);
        assert.equal(email, localPart + '@stu.huel.edu.cn');
    }
    assert.equal(context.used.size, 1000);
});
