const { readDatabase } = require('../models/database');

// Send one part of the existing portfolio data to API clients.
async function sendPortfolioPart(request, response, next, partName) {
  try {
    const database = await readDatabase();
    response.json({ success: true, data: database[partName] });
  } catch (error) {
    next(error);
  }
}

// Return public profile details from the original portfolio data store.
function getPortfolio(request, response, next) {
  sendPortfolioPart(request, response, next, 'portfolio');
}

// Return project cards and preserve the original featured and tag filters.
async function getProjects(request, response, next) {
  try {
    const database = await readDatabase();
    let projects = database.projects;

    if (request.query.featured === 'true') {
      projects = projects.filter((project) => project.featured);
    }

    if (request.query.tag) {
      const requestedTag = request.query.tag.toLowerCase();
      projects = projects.filter((project) => project.tags.some((tag) => tag.toLowerCase() === requestedTag));
    }

    response.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
}

// Return one project when its original ID exists.
async function getProject(request, response, next) {
  try {
    const database = await readDatabase();
    const project = database.projects.find((item) => item.id === request.params.id);

    if (!project) {
      response.status(404).json({ error: 'Project not found.' });
      return;
    }

    response.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

// Return skills, certificates, or experience from the existing data store.
const getSkills = (request, response, next) => sendPortfolioPart(request, response, next, 'skills');
const getCertificates = (request, response, next) => sendPortfolioPart(request, response, next, 'certificates');
const getExperience = (request, response, next) => sendPortfolioPart(request, response, next, 'experience');

module.exports = { getPortfolio, getProjects, getProject, getSkills, getCertificates, getExperience };
