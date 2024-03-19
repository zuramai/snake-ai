export const createElement = (name: keyof HTMLElementTagNameMap, attrs: Record<string,string>) => {
    const el = document.createElement(name)

    Object.keys(attrs).forEach(attr => {
        el.setAttribute(attr, attrs[attr])
    })

    return el 
}