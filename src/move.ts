// Please update this type as same as with the data shape.
type File = {
  id: string;
  name: string;
};
type Folder = {
  id: string;
  name: string;
  files: File[];
};
type List = Array<Folder>;

const findSource = (files: Array<File>, destination: string, source: string) => {
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    if (file.id === destination) {
      throw new Error('You cannot specify a file as the destination');
    }
    if (file.id === source) {
      return index;
    }
  }
  return -1;
};

export default function move(list: List, sourceId: string, destinationId: string): List {
  let tempDestination: Folder | undefined;
  let tempSourceFolder: Folder | undefined;
  let tempFileIndex = -1; //
  for (let listIndex = 0; listIndex < list.length; listIndex += 1) {
    const folder = list[listIndex];
    if (folder.id === sourceId) {
      throw new Error('You cannot move a folder');
    }
    if (folder.id === destinationId) {
      tempDestination = folder;
      if (tempSourceFolder) break;
    }
    const sourceIndex = findSource(folder.files, destinationId, sourceId);
    if (sourceIndex !== -1) {
      tempSourceFolder = folder;
      tempFileIndex = sourceIndex;
      if (tempDestination) break;
    }
  }
  if (!tempDestination || tempFileIndex === -1 || !tempSourceFolder) {
    throw new Error('Cannot found destination or source');
  }
  const deletedFile = tempSourceFolder.files.splice(tempFileIndex, 1)[0];
  tempDestination.files.push(deletedFile);
  return list;
}
