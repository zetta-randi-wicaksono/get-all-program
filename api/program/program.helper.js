// *************** IMPORT MODULE ***************
const Program = require('./program.model');
const Speciality = require('../speciality/speciality.model');
const Sector = require('../sector/sector.model');
const Level = require('../level/level.model');
const Campus = require('../campus/campus.model');
const School = require('../school/school.model');
const ScholarSeason = require('../scholar_season/scholar_season.model');

async function handleValidationForProgramInput(programInput) {
  if (programInput.name) {
    const programInputName = programInput.name;
    const programDataCheck = await Program.findOne({ name: programInputName }).collation({ locale: 'en', strength: 2 });

    if (programDataCheck) {
      throw new Error(`Name '${programInputName}' Has Already Been Taken`);
    }
  }

  if (programInput.speciality_id) {
    const specialityId = programInput.speciality_id;
    const specialityIdDataCheck = await Speciality.findOne({ _id: specialityId, status: 'active' });

    if (!specialityIdDataCheck) {
      throw new Error(`ID '${specialityId}' Not Found in Speciality Data`);
    }
  }

  if (programInput.sector_id) {
    const sectorId = programInput.sector_id;
    const sectorIdDataCheck = await Sector.findOne({ _id: sectorId, status: 'active' });

    if (!sectorIdDataCheck) {
      throw new Error(`ID '${sectorId}' Not Found in Sector Data`);
    }
  }

  if (programInput.level_id) {
    const levelId = programInput.level_id;
    const levelIdDataCheck = await Level.findOne({ _id: levelId, status: 'active' });

    if (!levelIdDataCheck) {
      throw new Error(`ID '${levelId}' Not Found in Level Data`);
    }
  }

  if (programInput.campus_id) {
    const campusId = programInput.campus_id;
    const campusIdDataCheck = await Campus.findOne({ _id: campusId, status: 'active' });

    if (!campusIdDataCheck) {
      throw new Error(`ID '${campusId}' Not Found in Campus Data`);
    }
  }

  if (programInput.school_id) {
    const schoolId = programInput.school_id;
    const schoolIdDataCheck = await School.findOne({ _id: schoolId, status: 'active' });

    if (!schoolIdDataCheck) {
      throw new Error(`ID '${schoolId}' Not Found in School Data`);
    }
  }

  if (programInput.scholar_season_id) {
    const scholarSeasonId = programInput.scholar_season_id;
    const scholarSeasonIdDataCheck = await ScholarSeason.findOne({ _id: scholarSeasonId, status: 'active' });

    if (!scholarSeasonIdDataCheck) {
      throw new Error(`ID '${scholarSeasonId}' Not Found in Scholar Season Data`);
    }
  }
}

// *************** EXPORT MODULE ***************
module.exports = { handleValidationForProgramInput };
