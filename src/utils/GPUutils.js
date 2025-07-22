import { getCurrentInstance } from 'vue';

export async function gpupipeline(predict, canvasCtxSupply, supply) {
    try {
        if (predict) {
            await supply(canvasCtxSupply());
        }
    } catch (error) {
        console.error(getCurrentInstance().type.__name, 'GPU 流水线过程失败:', error);
    }
}