function getSuggestions(queryText, ids) {
  // Temporary tag getting, should hook up to server

  const tagTitles = [];
  // Many possibilities to suggest tags; could suggest similar words based on lexical fields/synonyms
  tagTitles.push('informatique');
  tagTitles.push('tech');
  tagTitles.push('windows');

  // Add ids to tags
  const tags = [];
  tagTitles.forEach((title) => {
    // Turns "Sonic The Hedgehog" into "sonic-the-hedgehog"
    const tagId = title.replace(/\s+/g, '-').toLowerCase();
    if (!ids.tags.includes(tagId)) {
      tags.push({
        _id: tagId,
        displayName: title,
      });
    }
  });

  const tagLocations = [];
  tagLocations.push('CIV');
  tagLocations.push('Region Sud');
  tagLocations.push('Alpes Maritimes');

  // Add ids to tags
  const locations = [];

  tagLocations.forEach((title) => {
    // Turns "Sonic The Hedgehog" into "sonic-the-hedgehog"
    const locId = title.replace(/\s+/g, '-').toLowerCase();
    if (!ids.locations.includes(locId)) {
      locations.push({
        _id: `${locId}-location`,
        displayName: title,
      });
    }
  });

  const tagGroups = [];
  tagGroups.push('CIV');
  tagGroups.push("L'Aiglon");
  tagGroups.push('Club de Robotique');

  // Add ids to tags
  const groups = [];

  tagGroups.forEach((title) => {
    // Turns "Sonic The Hedgehog" into "sonic-the-hedgehog"
    const grpId = title.replace(/\s+/g, '-').toLowerCase();
    if (!ids.groups.includes(grpId)) {
      groups.push({
        _id: `${grpId}-group`,
        displayName: title,
      });
    }
  });

  return { tags, locations, groups };
}

const mapSuggestions = (item, icon, type) =>
  item.map((i) => ({ key: i._id, title: i.displayName, icon, type }));

export { mapSuggestions, getSuggestions };
