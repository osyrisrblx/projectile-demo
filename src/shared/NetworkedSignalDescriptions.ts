import type { NetworkedSignalDescription } from "@rbxts/networked-signals";
import { t } from "@rbxts/t";

export const NetworkedSignalDescriptions = {
	ProjectileCreated: identity<
		NetworkedSignalDescription<
			(character: Model, position: Vector3, velocity: Vector3, acceleration: Vector3, color: Color3) => void
		>
	>({
		name: "ProjectileCreated",
		typeChecks: [t.instanceOf("Model"), t.Vector3, t.Vector3, t.Vector3, t.Color3],
	}),
	ShootHumanoid: identity<NetworkedSignalDescription<(humanoid: Humanoid) => void>>({
		name: "ShootHumanoid",
		typeChecks: [t.instanceOf("Humanoid")],
	}),
};
