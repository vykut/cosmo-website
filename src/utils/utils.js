export const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export const ComponentTypes = {
    sign_in: 'sign-in',
    sign_up: 'sign-up',
    reset_password: 'reset_password',
}

export function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
}