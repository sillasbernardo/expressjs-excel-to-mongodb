/* --- @imports --- */
const lodash = require('lodash');
const fs = require('fs');
const path = require('path');

const ApiError = require('../../error/apiError');
const paginate = require('../../shared/paginateHandler');
const People = require('../../database/dbModel');
const clearData = require('../../shared/clearDataHandler');

/* --- @code --- */
const peopleController = async (req, res, next) => {
  try {
    const filterType = req.query.filterType;
    let typeContent = req.query.typeContent;
    const getRepeatedNames = req.query.getRepeatedNames;

    // Fetch all people from database
    const people = await People.find();

    let filteredData; // Only used if filtrType is defined
    if (filterType || getRepeatedNames) {
      // Returns an array of objects with special characters and vowels removed
      filteredData = await clearData.clearObjDataHandler(people);

      // If runs when user wants to find a specific person
      if (filterType) {
        // Pass a string and return the same string cleared from special characters and vowels
        typeContent = await clearData.clearStrDataHandler(
          filterType,
          typeContent
        );

        // Returns data that matches typeContent in filterType.
        // Eg: Return data that matches "Davis Morris" in "name"
        filteredData = filteredData.filter((data) =>
          data.modifiedInfo[filterType].includes(typeContent)
        );

        // Else runs when user wants repeated records
      } else {
        // Compares each object to all objects to find duplicated records
        filteredData = filteredData.map((firstRowData, firstRowIndex) => {
          let duplicatedRecord;
					let isRecordFound;

          filteredData.map((secondRowData, secondRowIndex) => {
            // lodash checks for equality
            const isPersonSame = lodash.isEqual(
              firstRowData.modifiedInfo,
              secondRowData.modifiedInfo
            );
            console.log(
              `Comparing person ${firstRowIndex}, ${firstRowData.modifiedInfo.name} to ${secondRowIndex}, ${secondRowData.modifiedInfo.name}`
            );
            if (isPersonSame) {
              // Checks for same person but different id
              // If objects has same id, it's the same record, then it's not valid
              if (
                firstRowData.modifiedInfo.id !== secondRowData.modifiedInfo.id
              ) {
                console.log(
                  `Found duplicated by name ${firstRowData.modifiedInfo.name}. Saving...`
                );
                duplicatedRecord = {
                  originalPerson: firstRowData.modifiedInfo,
                  duplicatedRecord: secondRowData.modifiedInfo,
                };
								isRecordFound = true;
              } else { isRecordFound = false }
            } else { isRecordFound = false }
          });

					if (isRecordFound){
						return duplicatedRecord;
					}
        });

        // Write saved data to log.json
        fs.writeFile(
          path.join(__dirname + '../../../../log.json'),
          JSON.stringify(filteredData),
          (err, result) => {
            if (err) {
              console.error(err);
              return next(ApiError.internal('Something went wrong'));
            }
            console.log('Log file saved.');
          }
        );
      }
    }

    // Returns only the 'limit' of people passed from frontend
    const paginatedPeople = await paginate(people);

    console.log('Finished');
    res.status(200).json(filteredData || people);

    /* SINCE THERE MIGHT BE MISTYPING IN EACH DATA IN DATABASE
			I NEED TO FETCH ALL OF THEM, CLEAR THEM USING 'clearData' FUNCTION
			AND VALIDATE THE MODIFIED DATA. AFTER THAT, I NEED TO
			FIND THE SAME MODIFIED DATA IN THE ORIGINAL DATA
			TO RETURN ONLY THE ORIGINAL DATA TO CLIENT.
			THE REASON WHY IS BECAUSE CLIENT NEED TO GET THE DATA
			FORMATED. SO SINCE SOME DATA MIGHT BE BADLY FORMATED.
			THIS ORIGINAL DATA WILL BE PASSED THROUGH A PROPER FORMATATION
			BEFORE DELIVERING TO CLIENT.

			THIS MAKES CHECKING FOR DUPLICATES AND VALIDATOR MORE
			CONCISE AND SECURE
		*/
  } catch (error) {}
};

/* --- @exports --- */
module.exports = peopleController;
