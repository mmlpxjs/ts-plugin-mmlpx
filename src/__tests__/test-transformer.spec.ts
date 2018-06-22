/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-21 17:07
 */

import { readFile } from 'fs';
import { join } from 'path';
import glob from 'tiny-glob/sync';
import ts from 'typescript';
import { promisify } from 'util';

import createTransformer from '../index';

const readFilePromise: (path: string, encoding: string) => Promise<string> = promisify(readFile);
const printer = ts.createPrinter();
const testDir = join(__dirname, 'fixtures');
const testFiles = glob('*/input.ts', { cwd: testDir, filesOnly: true });
const transformer = createTransformer([
	{ libraryName: 'mmlpx', bindings: ['Store', 'ViewModel'] },
	{ libraryName: 'mobx', bindings: ['action'] },
]);

testFiles.forEach(fileName => {

	test(fileName, async () => {
		const filePath = join(testDir, fileName);
		const [sourceCode, expectCode] = await Promise.all([
			readFilePromise(filePath, 'utf-8'),
			readFilePromise(filePath.replace('input.ts', 'output.ts'), 'utf-8'),
		]);
		const sourceFile = ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.ES2016, true);
		const transformedSourceFile = ts.transform(sourceFile, [transformer]).transformed[0];
		const transformedSourceCode = printer.printFile(transformedSourceFile);

		expect(transformedSourceCode).toBe(expectCode);
	});
});
