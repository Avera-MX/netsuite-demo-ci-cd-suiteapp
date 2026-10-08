import serverWidget from 'N/ui/serverWidget';
import Form from 'N/ui/serverWidget/form';
import Field from 'N/ui/serverWidget/field';
import helloWorldSuitelet from 'SuiteScripts/services/suitelet/HelloWorld.Suitelet';

jest.mock('N/ui/serverWidget');
jest.mock('N/ui/serverWidget/form');
jest.mock('N/ui/serverWidget/field');

describe('HelloWorld Suitelet', () => {
    let scriptContext;

    beforeEach(() => {
        jest.clearAllMocks();
        Field.defaultValue = undefined;
        serverWidget.createForm.mockReturnValue(Form);
        Form.addField.mockReturnValue(Field);

        scriptContext = {
            request: { method: 'GET', parameters: {} },
            response: { writePage: jest.fn() }
        };
    });

    it('exposes only the onRequest entry point', () => {
        expect(Object.keys(helloWorldSuitelet)).toEqual(['onRequest']);
        expect(typeof helloWorldSuitelet.onRequest).toBe('function');
    });

    it('creates the form with the Avera MX title', () => {
        helloWorldSuitelet.onRequest(scriptContext);

        expect(serverWidget.createForm).toHaveBeenCalledTimes(1);
        expect(serverWidget.createForm).toHaveBeenCalledWith({ title: 'Avera MX' });
    });

    it('adds the greeting field as inline HTML', () => {
        helloWorldSuitelet.onRequest(scriptContext);

        expect(Form.addField).toHaveBeenCalledTimes(1);
        expect(Form.addField).toHaveBeenCalledWith({
            id: 'greeting',
            label: 'Saludo',
            type: serverWidget.FieldType.INLINEHTML
        });
    });

    it('fills the greeting field with the Hello World markup', () => {
        helloWorldSuitelet.onRequest(scriptContext);

        expect(Field.defaultValue).toContain('<h1');
        expect(Field.defaultValue).toContain('Hello, World!');
        expect(Field.defaultValue).toContain('Made with ❤️ by the Avera Engineering Team.');
    });

    it('writes the created form to the response', () => {
        helloWorldSuitelet.onRequest(scriptContext);

        expect(scriptContext.response.writePage).toHaveBeenCalledTimes(1);
        expect(scriptContext.response.writePage).toHaveBeenCalledWith(Form);
    });

    it.each(['GET', 'POST'])('renders the same page for %s requests', (method) => {
        scriptContext.request.method = method;

        helloWorldSuitelet.onRequest(scriptContext);

        expect(scriptContext.response.writePage).toHaveBeenCalledWith(Form);
    });

    it('propagates errors raised while building the form', () => {
        serverWidget.createForm.mockImplementation(() => {
            throw new Error('SSS_MISSING_REQD_ARGUMENT');
        });

        expect(() => helloWorldSuitelet.onRequest(scriptContext)).toThrow('SSS_MISSING_REQD_ARGUMENT');
        expect(scriptContext.response.writePage).not.toHaveBeenCalled();
    });
});
