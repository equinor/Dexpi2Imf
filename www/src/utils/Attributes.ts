export default function setAttributes(el: Element, attrs: object) {
    Object.keys(attrs).forEach(key => el.setAttribute(key, attrs[key]));
}