/* --- @imports --- */
const ApiError = require('../error/apiError');

/* --- @code --- */

// This is an internal function and it takes
// a string as input with special vowels and return
// a string with regular vowels
const replaceSpecialVowels = (value) => {
  value = value.toLowerCase();

  // Vowels to be changed
  const vowels = [
    ['á', 'à', 'ã', 'â'],
    ['é', 'è', 'ê'],
    ['í', 'ì', 'î'],
    ['ó', 'ò', 'ô', 'õ'],
    ['ú', 'ù', 'û'],
  ];

  // Vowels to be changed to
  const newVowel = ['a', 'e', 'i', 'o', 'u'];

  vowels.map((vowelCategory) => {
    vowelCategory.map((vowel) => {
      // Chose a newVowel character from the same position
      // as vowels. It means that if vowelCategory is currently
      // at position 3, it's matching ["í", "ì", "î"], then
      // any value that matches of one the three will be
      // replaced by "i", the third position in newVowel array.
      for (let initial = 0; initial < newVowel.length; initial++) {
        if (vowelCategory === vowels[initial]) {
          value = value.replace(vowel, newVowel[initial]);
        }
      }
    });
  });

  return value;
};

// This function takes an array of objects as input and remove
// any special character and special vowels in it.
// It returns an array of objects, each object
// with two objects: the original object and the
// modified object.
//
// Used to convert each object that is fetched
// from database for validation purpose.
const clearObjDataHandler = async (data) => {
  try {
    // Return each person cleared
    const clearedData = data.map((person) => {
      return {
        originalInfo: person,
        modifiedInfo: {
          id: person._id,
          name: replaceSpecialVowels(person.name), // Lowercase and remove special vowels
          cpf_rg: person.cpf_rg.replace(/[.-\s]/g, ''), // remove special characters
          nis: person.nis.replace(/[.-\s]/g, ''), // remove special characters
          phone: person.phone.replace(/[()-\s]/g, ''), // remove special characters
          local: replaceSpecialVowels(person.local), // lowercase and remove special vowels
        },
      };
    });

    return clearedData;
  } catch (error) {
    console.error(error);
    throw ApiError.internal('Something went wrong');
  }
};

// This function takes two properties: the type and content
// as input and just like the above function, it removes
// any special characters or special vowels.
//
// It returns a modified string as output.
const clearStrDataHandler = async (type, content) => {
  try {
    let modifiedContent;

    if (type === "name" || type === "local"){
      modifiedContent = replaceSpecialVowels(content);
    } else {
      modifiedContent = content.replace(/[().-\s]/g,'');
    }

    return modifiedContent;
  } catch (error) {
    console.error(error)
    throw ApiError.internal('Something went wrong')
  }
}

/* --- @exports --- */
exports.clearObjDataHandler = clearObjDataHandler;
exports.clearStrDataHandler = clearStrDataHandler;
