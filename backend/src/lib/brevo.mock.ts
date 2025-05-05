import { sendEmailWithBrevo } from "./brevo";

jest.mock('./brevo', () => {
    const original = jest.requireActual('./brevo');
    const mockedSendEmailWithBrevo: typeof sendEmailWithBrevo = jest.fn(async () => {
        return {
            loggableResponse: {
                status: 200,
                statusText: 'OK',
                data: { message: 'mocked' }
            }
        }
    })
    return {
        ...original,
        sendEmailWithBrevo: mockedSendEmailWithBrevo
    }
})