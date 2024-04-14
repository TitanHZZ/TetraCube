import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import { Raycaster, Vector3 } from 'three';

export const useForwardRaycast = (obj) => {
    const raycaster = useMemo(() => new Raycaster(), []);
    const pos = useMemo(() => new Vector3(), []);
    const dir = useMemo(() => new Vector3(), []);
    const scene = useThree(state => state.scene);

    return () => {
        if (!obj.current)
            return [];

        raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir));
        return raycaster.intersectObjects(scene.children);
    }
}
