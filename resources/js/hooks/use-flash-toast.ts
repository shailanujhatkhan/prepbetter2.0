import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useFlashToast() {
    const { flash } = usePage().props;
    const shown = useRef<string | null>(null);

    useEffect(() => {
        const key = `${flash.success || ''}|${flash.error || ''}`;
        if (key === '|' || shown.current === key) return;
        shown.current = key;

        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash.success, flash.error]);
}
