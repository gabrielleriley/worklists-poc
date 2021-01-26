import { ActionCreator } from '@ngrx/store';
import { ILoadableActionProps, ILoadablePagedActionProps } from '../entity-actions';

type TypedEntityAction = { type: string };
export type EntityFunction<Payload> = (props: ILoadableActionProps<Payload, any>) => TypedEntityAction & ILoadableActionProps<Payload, any>;
export type EntityActionCreator<Payload> = ActionCreator<string, EntityFunction<Payload>>;
export type EntityPageFunction<Entity> = (props: ILoadablePagedActionProps<Entity[], any>) => ILoadablePagedActionProps<Entity[], any> & TypedEntityAction;
export type EntityPageActionCreator<Entity> = ActionCreator<string, EntityPageFunction<Entity>>;