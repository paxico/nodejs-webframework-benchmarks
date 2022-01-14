declare module 'seedrandom' {
  export type TSeedOptions = { global: boolean };
  export default function seedrandom(seed: any, options?: TSeedOptions): () => number;
}