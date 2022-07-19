const Space = () => ' '
const LineBreak = () => <br />
// Marks soft breaks between sentences. <wbr> or &shy; wouldn't make sense here.
const SoftBreak = () => ' '

export { Space, LineBreak, SoftBreak }
