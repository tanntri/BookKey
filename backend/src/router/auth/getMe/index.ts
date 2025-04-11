import _ from 'lodash';
import { trpc } from '../../../lib/trpc';
import { toClientMe } from '../../../lib/models';

export const getMeTrpcRoute = trpc.procedure.query(({ctx}) => {
    return { me: toClientMe(ctx.me) };
})