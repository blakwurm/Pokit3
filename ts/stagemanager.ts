import { IEntityIdentity, PokitEntity } from "./ecs";
import { PokitOS } from "./pokitos";

export interface IStageData {
    [entity: string]: IStagePrefab
}

export interface IStagePrefab {
    prefab: string[],
    identity: IEntityIdentity
}

export interface IStages {
    [stage: string]: IStageData
}

export class StageManager {
    templates: Map<string, IStageData>;
    current: Stage;
    private _engine: PokitOS;
    constructor(engine:PokitOS) {
        this._engine = engine;
    }
    init(stages:IStages) {
        this.templates = new Map(Object.entries(stages));
    }
    getStage(stage: string, startLoad: boolean): Stage {
        let template = this.templates.get(stage);
        return new Stage(this._engine, template, startLoad);
    }
}

export class Stage {
    load: Promise<Stage>;
    prefabs: Map<string, IStagePrefab>;
    entities: Map<string,PokitEntity>;

    private _engine: PokitOS;
    constructor(engine: PokitOS, template: IStageData, loadOnInit: boolean = true) {
        this.prefabs = new Map(Object.entries(template));
        this._engine = engine;
        if(loadOnInit) this.startLoad();
    }
    startLoad() {
        this.load = this.loadStage();
        return this.load;
    }
    activate() {
        this._engine.ecs.clear();
        [...this.entities.values()].forEach(x=>x.activate());
        this._engine.stageManager.current = this;
    }
    private async loadStage(): Promise<Stage> {
        let entities = new Map<string, PokitEntity>();
        this.prefabs.forEach((v,k)=>entities.set(k, this._engine.ecs.makeShadow(v.identity, ...v.prefab)));
        this.entities = entities;
        return this;
    }
}