// Validator JSON Schema minimal (draft-07, doar ce folosește schema.json): fără dependențe externe.
export function validate(schema, value, at = '(root)') {
  const errs = [];
  const err = (m) => errs.push(at + ': ' + m);
  const type = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  if (schema.enum && !schema.enum.includes(value)) err('valoare în afara enumerării: ' + JSON.stringify(value));
  if (schema.type && schema.type !== type) { err('tip ' + type + ', așteptat ' + schema.type); return errs; }
  if (type === 'string') {
    if (schema.minLength != null && value.length < schema.minLength) err('prea scurt');
    if (schema.maxLength != null && Array.from(value).length > schema.maxLength) err('prea lung (' + Array.from(value).length + ' > ' + schema.maxLength + ')');
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) err('nu respectă ' + schema.pattern + ': ' + JSON.stringify(value));
  }
  if (type === 'array') {
    if (schema.minItems != null && value.length < schema.minItems) err('prea puține elemente');
    if (schema.maxItems != null && value.length > schema.maxItems) err('prea multe elemente');
    if (schema.uniqueItems && new Set(value.map((v) => JSON.stringify(v))).size !== value.length) err('elemente duplicate');
    if (schema.items) value.forEach((v, i) => errs.push(...validate(schema.items, v, at + '/' + i)));
  }
  if (type === 'object') {
    for (const k of schema.required || []) if (!(k in value)) err('lipsește «' + k + '»');
    const props = schema.properties || {};
    for (const k of Object.keys(value)) {
      if (props[k]) errs.push(...validate(props[k], value[k], at + '/' + k));
      else if (schema.additionalProperties === false) err('câmp necunoscut «' + k + '»');
    }
  }
  return errs;
}
