export function getHumanoid(instance: Instance): Humanoid | undefined {
	const model = instance.FindFirstAncestorWhichIsA("Model");
	if (model) {
		const humanoid = model.FindFirstChildWhichIsA("Humanoid");
		if (humanoid) {
			return humanoid;
		}
		return getHumanoid(model);
	}
}
