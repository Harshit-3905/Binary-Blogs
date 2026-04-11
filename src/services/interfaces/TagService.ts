/**
 * A tag is represented by its canonical name. If richer metadata is needed
 * later (usage counts, descriptions, colors) widen this to an object; all
 * consumers currently just want the name list.
 */
export interface TagService {
  /** Popular/featured tags shown in tag filters and pickers. */
  listFeatured(): Promise<string[]>;
}
