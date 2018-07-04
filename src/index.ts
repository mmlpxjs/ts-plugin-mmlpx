/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-21 16:00
 */
import path from 'path';
import ts from 'typescript';

type Options = {
	libraryName?: string;
	bindings?: string[];
};

type BindingsMap = {
	[p: string]: string[];
};

const defaultOptions = {
	libraryName: 'mmlpx',
	bindings: ['Store', 'ViewModel'],
};

const createTransformer = (_options: Array<Partial<Options>> = [defaultOptions]) => {

	const mergeDefault = (options: Partial<Options>) => ({ ...defaultOptions, ...options });
	const bindingsMap: BindingsMap = _options.reduce((acc: any, options) => {
		const result = mergeDefault(options);
		acc[result.libraryName] = result.bindings;
		return acc;
	}, {});

	const isTargetLib = (lib: string) => Object.keys(bindingsMap).indexOf(lib) !== -1;
	const isTargetBinding = (lib: string, binding: string) => bindingsMap[lib].indexOf(binding) !== -1;

	const transformer: ts.TransformerFactory<ts.SourceFile> = context => {

		const bindings: string[] = [];
		let fileName: string;

		const visitor: ts.Visitor = node => {

			if (ts.isSourceFile(node)) {
				fileName = path.basename(node.fileName);
				return ts.visitEachChild(node, visitor, context);
			}

			if (ts.isImportDeclaration(node) && isTargetLib((node.moduleSpecifier as ts.StringLiteral).text)) {

				node.forEachChild(importChild => {

					if (ts.isImportClause(importChild) && importChild.namedBindings && ts.isNamedImports(importChild.namedBindings)) {

						(importChild.namedBindings as ts.NamedImports).elements.forEach(({ propertyName, name }) => {

							const lib = (node.moduleSpecifier as ts.StringLiteral).text;
							const namedBinding = (propertyName && propertyName.getText()) || name.getText();
							const aliasBinding = propertyName && name.getText();
							if (isTargetBinding(lib, namedBinding)) {
								bindings.push(aliasBinding || namedBinding);
							}
						});
					}
				});

				return node;
			}

			if (node.decorators) {

				node.decorators.forEach(decorator => {

					const { expression } = decorator;
					if (ts.isIdentifier(expression) && bindings.indexOf(expression.getText()) !== -1) {
						decorator.expression = ts.createCall(expression, undefined,
							[ts.createLiteral(`${fileName}/${(node as any).name.getText()}`)]);
					}
				});

				return node;
			}

			return ts.visitEachChild(node, visitor, context);
		};

		return node => ts.visitNode(node, visitor);
	};

	return transformer;
};

export default createTransformer;
