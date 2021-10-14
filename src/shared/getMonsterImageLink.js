const getMonsterImageLink = () =>
{
  //console.log('getMonsterImageLink: ');
  
  //// EXPORT FUNCTIONS

  const getImageLink = (monsterId, monsterName) =>
  {
    const partialImageUrl = 'https://img.pokemondb.net/artwork/large/';
    let imageLink = partialImageUrl + monsterName + '.jpg';
    if (monsterId === 778)
    {
      imageLink = partialImageUrl + 'mimikyu' + '.jpg';
    }
    return imageLink;
  };

  return { getImageLink };
}

export default getMonsterImageLink;
