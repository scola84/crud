import { json } from '@scola/codec';
import { createBrowser } from '@scola/http';
import { LinkMerger } from '../../../link/select';
import { LinkGetter } from '../../../link/view';

export default function createFill(structure, link) {
  const linkMerger = new LinkMerger();

  const linkGetter = new LinkGetter({
    link: link.name,
    name: structure.name
  });

  linkGetter
    .through(createBrowser(json))
    .connect(linkMerger);

  return [linkGetter, linkMerger];
}
