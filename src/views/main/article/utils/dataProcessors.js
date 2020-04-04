function genTagData(article) {
  // TODO: Messy code
  const data = [];
  data.push({
    type: 'group',
    avatar: article.group.thumbnailUrl || '',
    icon: 'newspaper', // Just in case thumbnail url is undefined
    text: article.group.displayName,
    id: article.group.groupId,
  });
  data.push(
    ...article.tags.map((tag) => ({
      type: 'tag',
      text: tag.name,
      color: tag.color,
      id: tag.tagId,
    })),
  );
  data.push({
    type: 'author',
    icon: 'account',
    text: article.author.displayName,
    id: article.author.userId,
  });
  if (article.location.global) {
    data.push({
      type: 'global',
      icon: 'map-marker',
      text: 'France',
      id: '',
    });
  }

  data.push(
    ...article.location.schools.map((school) => ({
      type: 'school',
      icon: 'map-marker',
      text: school.displayName,
      id: school.schoolId,
    })),
  );

  data.push(
    ...article.location.departments.map((department) => ({
      type: 'department',
      icon: 'map-marker',
      text: department.displayName,
      id: department.departmentId,
    })),
  );

  return data;
}

module.exports = { genTagData };
