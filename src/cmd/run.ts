import { resolve } from 'path';
import { writeFileSync } from 'fs';

import { Command } from 'commander';

import { get } from '../actions/run';
import { format } from '../utils/print';

const applyCommand = (program: Command) => {
    const command = new Command('run');

    command.description('Commands to view runs.');  // TODO: update once functionality expands

    command.requiredOption('-p, --project <id>', 'project id');
    command
        .command('get <id>')
        .description('Retrieve data about a run')
        .option('--format', 'output format', 'json')
        .option('--out-file', 'output file path')
        .action(async (runId: string, cmd: Command) => {
            const parent = cmd.parent;
            const projectId = parent.project;
            const accessToken = parent.parent.accessToken ?? process.env.REFACTR_AUTH_TOKEN;
            if (!accessToken) {
                throw new Error('Auth token is required.');
            }
            const basePath = parent.parent.apiUrl;

            const { data } = await get(projectId, runId, accessToken, basePath);
            console.info(cmd);
            const formatted = format(cmd.format, data);
            if (cmd.outFile) {
                const outputPath = resolve(cmd.outFile);
                writeFileSync(outputPath, formatted, 'utf8');
            } else {
                console.log(formatted);
            }
        });

    program.addCommand(command);
};

export default applyCommand;
