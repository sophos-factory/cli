import credential from './credential';
import job from './job';
import organization from './organization';
import project from './project';
import run from './run';
import pipelineRevision from './pipeline-revision';
import runner from './runner';

const getCommandMap = {
  credential,
  job,
  organization,
  project,
  'pipeline-revision': pipelineRevision,
  run,
  runner
};

export default getCommandMap;
