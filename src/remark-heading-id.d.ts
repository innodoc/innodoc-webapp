// Fix missing type declarations
declare module 'remark-heading-id' {
  export default function remarkHeadingId(): import('unified').Transformer<
    import('mdast').Root,
    import('mdast').Root
  >
}
