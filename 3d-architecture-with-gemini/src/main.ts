import { 
    Engine, Scene, ArcRotateCamera, HemisphericLight, DirectionalLight, Vector3, 
    MeshBuilder, StandardMaterial, Color3, Animation, AnimationGroup, 
    AbstractMesh, Mesh, DynamicTexture, PointerEventTypes
} from '@babylonjs/core';

interface WalletModule {
    name: string;
    description: string;
    position: Vector3;
    color: Color3;
    size: Vector3;
    mesh?: Mesh;
}

class WalletArchitecture {
    private scene: Scene;
    private modules: WalletModule[] = [];
    private connectionLines: Mesh[] = [];
    private animationGroup: AnimationGroup;

    constructor(scene: Scene) {
        this.scene = scene;
        this.animationGroup = new AnimationGroup("walletAnimations", scene);
        this.defineArchitecture();
        this.createModules();
        this.createConnections();
        this.setupInteractions();
    }

    private defineArchitecture() {
        this.modules = [
            // 用户层
            {
                name: "Web界面",
                description: "用户Web界面\n- 登录/注册\n- 钱包管理\n- 交易记录",
                position: new Vector3(-8, 8, 0),
                color: new Color3(0.2, 0.6, 1),
                size: new Vector3(3, 1.5, 1)
            },
            {
                name: "移动端APP",
                description: "移动端应用\n- iOS/Android客户端\n- 生物识别\n- 推送通知",
                position: new Vector3(-8, 5, 0),
                color: new Color3(0.3, 0.7, 1),
                size: new Vector3(3, 1.5, 1)
            },
            
            // API网关层
            {
                name: "API网关",
                description: "API网关服务\n- 身份验证\n- 限流控制\n- 路由分发",
                position: new Vector3(-3, 6.5, 0),
                color: new Color3(0.8, 0.4, 0.2),
                size: new Vector3(2.5, 1.5, 1)
            },
            
            // 业务逻辑层
            {
                name: "用户服务",
                description: "用户管理服务\n- 用户注册\n- 身份验证\n- 权限管理",
                position: new Vector3(2, 8, 0),
                color: new Color3(0.2, 0.8, 0.4),
                size: new Vector3(2.5, 1.5, 1)
            },
            {
                name: "钱包服务",
                description: "钱包核心服务\n- 钱包创建\n- 密钥管理\n- 余额查询",
                position: new Vector3(2, 5.5, 0),
                color: new Color3(0.2, 0.8, 0.4),
                size: new Vector3(2.5, 1.5, 1)
            },
            {
                name: "交易服务",
                description: "交易处理服务\n- 交易创建\n- 交易签名\n- 交易广播",
                position: new Vector3(2, 3, 0),
                color: new Color3(0.2, 0.8, 0.4),
                size: new Vector3(2.5, 1.5, 1)
            },
            
            // 数据存储层
            {
                name: "用户数据库",
                description: "用户数据存储\n- PostgreSQL\n- 用户信息\n- 登录日志",
                position: new Vector3(7, 8, 0),
                color: new Color3(0.6, 0.2, 0.8),
                size: new Vector3(2.5, 1.5, 1)
            },
            {
                name: "钱包数据库",
                description: "钱包数据存储\n- 加密存储\n- 钱包地址\n- 交易记录",
                position: new Vector3(7, 5.5, 0),
                color: new Color3(0.6, 0.2, 0.8),
                size: new Vector3(2.5, 1.5, 1)
            },
            {
                name: "缓存层",
                description: "Redis缓存\n- 会话管理\n- 频率限制\n- 实时数据",
                position: new Vector3(7, 3, 0),
                color: new Color3(0.6, 0.2, 0.8),
                size: new Vector3(2.5, 1.5, 1)
            },
            
            // 区块链交互层
            {
                name: "区块链节点",
                description: "区块链节点\n- Bitcoin节点\n- Ethereum节点\n- 其他链节点",
                position: new Vector3(2, 0, 0),
                color: new Color3(0.8, 0.6, 0.1),
                size: new Vector3(2.5, 1.5, 1)
            },
            
            // 安全层
            {
                name: "HSM模块",
                description: "硬件安全模块\n- 密钥生成\n- 安全存储\n- 数字签名",
                position: new Vector3(7, 0, 0),
                color: new Color3(0.8, 0.2, 0.2),
                size: new Vector3(2.5, 1.5, 1)
            },
            
            // 监控层
            {
                name: "监控系统",
                description: "系统监控\n- 性能监控\n- 日志分析\n- 告警系统",
                position: new Vector3(-3, 3, 0),
                color: new Color3(0.5, 0.5, 0.5),
                size: new Vector3(2.5, 1.5, 1)
            }
        ];
    }

    private createModules() {
        this.modules.forEach((module, index) => {
            const box = MeshBuilder.CreateBox(module.name, {
                width: module.size.x,
                height: module.size.y,
                depth: module.size.z
            }, this.scene);
            
            box.position = module.position;
            module.mesh = box;

            const material = new StandardMaterial(`${module.name}_material`, this.scene);
            material.diffuseColor = module.color;
            material.specularColor = new Color3(0.2, 0.2, 0.2);
            material.emissiveColor = module.color.scale(0.1);
            box.material = material;

            const labelTexture = new DynamicTexture(`${module.name}_label`, {width: 512, height: 256}, this.scene);
            labelTexture.drawText(module.name, null, null, "bold 36px Arial", "#FFFFFF", "transparent", true);
            
            const labelMaterial = new StandardMaterial(`${module.name}_label_material`, this.scene);
            labelMaterial.diffuseTexture = labelTexture;
            labelMaterial.emissiveColor = new Color3(0.5, 0.5, 0.5);
            
            const label = MeshBuilder.CreatePlane(`${module.name}_label_plane`, {width: 3, height: 1.5}, this.scene);
            label.position = new Vector3(module.position.x, module.position.y + module.size.y + 1, module.position.z);
            label.billboardMode = AbstractMesh.BILLBOARDMODE_ALL;
            label.material = labelMaterial;

            this.createFloatingAnimation(box, index);
        });
    }

    private createConnections() {
        const connections = [
            [0, 2], [1, 2], // 用户层 -> API网关
            [2, 3], [2, 4], [2, 5], // API网关 -> 业务服务
            [3, 6], [4, 7], [5, 8], // 业务服务 -> 数据库
            [5, 9], [4, 10], // 交易服务 -> 区块链, 钱包服务 -> HSM
            [2, 11], [3, 11], [4, 11], [5, 11] // 所有服务 -> 监控
        ];

        connections.forEach(([from, to]) => {
            const line = this.createConnection(this.modules[from].position, this.modules[to].position);
            this.connectionLines.push(line);
        });
    }

    private createConnection(from: Vector3, to: Vector3): Mesh {
        const distance = Vector3.Distance(from, to);
        const cylinder = MeshBuilder.CreateCylinder("connection", {
            height: distance,
            diameter: 0.05
        }, this.scene);

        const midPoint = Vector3.Lerp(from, to, 0.5);
        cylinder.position = midPoint;
        cylinder.lookAt(to);

        const material = new StandardMaterial("connection_material", this.scene);
        material.diffuseColor = new Color3(0.3, 0.3, 0.3);
        material.emissiveColor = new Color3(0.1, 0.1, 0.1);
        cylinder.material = material;

        return cylinder;
    }

    private createFloatingAnimation(mesh: Mesh, index: number) {
        const animationY = Animation.CreateAndStartAnimation(
            `float_${index}`,
            mesh,
            "position.y",
            30,
            120,
            mesh.position.y,
            mesh.position.y + 0.3,
            Animation.ANIMATIONLOOPMODE_CYCLE
        );

        if (animationY) {
            animationY.setKeys([
                { frame: 0, value: mesh.position.y },
                { frame: 60, value: mesh.position.y + 0.3 },
                { frame: 120, value: mesh.position.y }
            ]);
        }
    }

    private setupInteractions() {
        this.scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
                const pickInfo = this.scene.pick(pointerInfo.event.offsetX, pointerInfo.event.offsetY);
                if (pickInfo.hit && pickInfo.pickedMesh) {
                    const meshName = pickInfo.pickedMesh.name;
                    const module = this.modules.find(m => m.name === meshName);
                    if (module) {
                        this.showModuleInfo(module);
                    }
                }
            }
        });
    }

    private showModuleInfo(module: WalletModule) {
        const infoDiv = document.getElementById('moduleInfo') || this.createInfoDiv();
        infoDiv.innerHTML = `
            <h3>${module.name}</h3>
            <p>${module.description.replace(/\n/g, '<br>')}</p>
        `;
        infoDiv.style.display = 'block';
    }

    private createInfoDiv(): HTMLElement {
        const infoDiv = document.createElement('div');
        infoDiv.id = 'moduleInfo';
        infoDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 5px;
            max-width: 300px;
            font-family: Arial, sans-serif;
            z-index: 1000;
            display: none;
        `;
        document.body.appendChild(infoDiv);
        
        infoDiv.addEventListener('click', () => {
            infoDiv.style.display = 'none';
        });
        
        return infoDiv;
    }
}

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new Engine(canvas, true);

const createScene = () => {
    const scene = new Scene(engine);
    scene.createDefaultEnvironment();

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 20, new Vector3(0, 4, 0), scene);
    camera.attachControl(canvas, true);
    camera.setTarget(new Vector3(0, 4, 0));

    const light = new HemisphericLight("hemisphericLight", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const directionalLight = new DirectionalLight("directionalLight", new Vector3(0, -1, 0), scene);
    directionalLight.position = new Vector3(0, 20, 0);
    directionalLight.intensity = 0.5;

    new WalletArchitecture(scene);

    return scene;
};

const scene = createScene();

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener('resize', () => {
    engine.resize();
});
