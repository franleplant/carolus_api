export interface ERC721Attr {
  display_type?: string;
  trait_type?: string;
  value: string;
}
/** docs https://docs.opensea.io/docs/metadata-standards */
export interface ERC721Metadata {
  /** Identifies the asset to which this NFT represents */
  name: string;
  /** Describes the asset to which this NFT represents */
  description: string;
  external_url?: string;
  /**
   * A URI pointing to a resource with mime type image
   * representing the asset to which this NFT represents.
   * Consider making any images at a width between 320 and 1080
   * pixels and aspect ratio between 1.91:1 and 4:5 inclusive.
   *
   **/
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
  image?: string;
  attributes?: Array<ERC721Attr>;
}

export interface OSCollectionMetadata {
  name: string;
  description: string;
  image: string;
  external_link: string;
  /** Indicates a 1% seller fee. */
  seller_fee_basis_points: number;
  /** Where seller fees will be paid to. Address */
  fee_recipient: string;
}
