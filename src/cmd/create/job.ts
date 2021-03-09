import isNil from 'lodash/isNil';
import {
  JobScheduleIntervalTypeEnum,
  JobTriggerTypeEnum
} from '@refactr/api-client';

import { createCommandResult, handler } from '../handler';
import { JobTriggerType } from '../../job-trigger-type';

type Arguments = {
  projectId: string;
  pipelineId: string;
  revisionId: string;
  name: string;
  type: JobTriggerType;
  data?: any;

  suppressOutputs: boolean;
  suppressEvents: boolean;
  suppressVariables: boolean;
  disableOnFailure: boolean;

  schedule?: {
    startDay: string;
    startTime: string;
    offset: string;
    interval: number;
    intervalType: 'minute' | 'hour' | 'day' | 'week' | 'month';
  };
};

const triggerType = {
  manual: JobTriggerTypeEnum.Manual,
  scheduled: JobTriggerTypeEnum.Scheduled
};

const intervalType = {
  minute: JobScheduleIntervalTypeEnum.Minute,
  hour: JobScheduleIntervalTypeEnum.Hour,
  day: JobScheduleIntervalTypeEnum.Day,
  week: JobScheduleIntervalTypeEnum.Week,
  month: JobScheduleIntervalTypeEnum.Month
};

export default handler<Arguments, any>(
  async (
    apiClient,
    {
      projectId,
      pipelineId,
      revisionId,
      name,
      type,
      suppressEvents,
      suppressOutputs,
      suppressVariables,
      disableOnFailure,
      schedule
    }
  ) => {
    const api = apiClient.jobs;

    const { data: job } = await api.createJob(projectId, {
      pipeline_id: pipelineId,
      pipeline_revision_id: revisionId,
      trigger_type: triggerType[type],
      name,
      suppress_events: suppressEvents,
      suppress_outputs: suppressOutputs,
      suppress_vars: suppressVariables,
      disable_on_failure: disableOnFailure,

      schedule: !isNil(schedule)
        ? {
            start_day: schedule.startDay,
            start_time: schedule.startTime,
            offset: schedule.offset,
            interval: schedule.interval,
            interval_type: !isNil(schedule.intervalType)
              ? intervalType[schedule.intervalType]
              : undefined
          }
        : undefined
    });

    return createCommandResult('view', job, ['_id']);
  }
);
