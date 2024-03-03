<template>
    <div v-if="list" class="main">
        <div class="progress">
            <span>下载进度</span>
            <el-progress :percentage="percent" text-inside stroke-width="18" />
            <p>{{ speed }}</p>
            <div class="btns">
                <el-button type="primary" round :disabled="isBtn ? false : true" @click="onClick">全部开始</el-button>
                <el-button round :disabled="isBtn ? true : false" @click="onClick">全部暂停</el-button>
                <el-button round :disabled="isBtn ? true : false" @click="onClick">全部取消</el-button>
            </div>
        </div>
        <div class="downloadList">
            <div class="item" v-for="(item, index) in list" :key="item.name">
                <div class="itemLeft">
                    <img :src="item.img">
                    <div class="txt">
                        <h3>{{ item.name }}</h3>
                        <p>{{ item.now }} / {{ item.size }}</p>
                    </div>
                </div>
                <div class="itemRight">
                    <span>{{ item.time }}</span>
                    <div class="item-progress">
                        <el-progress :percentage="item.percent" indeterminate :duration="5" stroke-width="15" />
                    </div>
                    <span>{{ item.speed }}</span>
                    <div class="item-btns">
                        <el-icon size="1.5rem">
                            <VideoPause v-if="isBtn" />
                            <VideoPlay v-else />
                        </el-icon>
                        <el-icon size="1.5rem" @click="remove(index)">
                            <CloseBold />
                        </el-icon>
                        <el-icon size="1.5rem">
                            <Folder />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="empty">
        <el-empty :image="require('../assets/downloadEmpty.png')" description="当前没有下载任务哦~" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const list = [
    {
        name: '20220618全片改bug.mp4',
        img: require('../assets/img.png'),
        size: '3MB',
        now: '2MB',
        percent: '10',
        time: '10:10:10',
        speed: '50KB/S'
    },
    {
        name: '20220618全片改bug.mp4',
        img: require('../assets/img.png'),
        size: '4MB',
        now: '1MB',
        percent: '10',
        time: '10:10:10',
        speed: '50KB/S'
    }
]
const percent = ref(50)
const speed = ref('50 kb/s')
const isBtn = ref(true)
const onClick = () => { isBtn.value = !isBtn.value }

// 未实现删除功能
const remove: (index: number) => void = (index) => { list.splice(index, 1) }
</script>

<style scoped lang="scss">
.main {
    display: flex;
    flex-direction: column;

    .progress {
        margin: 0.5rem 0 0 2rem;
        display: flex;
        align-items: center;

        >span {
            margin-right: 1rem;
        }

        .el-progress {
            flex: 1;
            width: 30rem;
        }

        >p {
            margin-left: 1rem;
            color: #409EFF;
        }

        .btns {
            margin: 0 2rem 0 1rem;
        }
    }

    .downloadList {

        .item {
            display: flex;
            margin: 1rem 2.5rem;
            align-items: center;
            justify-content: space-between;

            .itemLeft {
                display: flex;
                align-items: center;


                >img {
                    width: 2rem;
                    height: 2.5rem;
                    margin-right: 1rem;
                }

                .txt {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;

                    >h3,
                    >p {
                        margin: 0;
                    }

                    >p {
                        display: block;
                        text-align: left;
                        color: gray;
                    }
                }
            }

            .itemRight {
                display: flex;
                align-items: center;


                .item-progress {
                    margin: 0 1rem;
                    width: 15rem;
                }

                .item-btns {
                    margin-left: 1rem;
                    display: flex;
                    align-items: center;
                    width: 5rem;
                    justify-content: space-between;
                    cursor: pointer;
                }
            }
        }
    }
}

.empty {
    margin-top: 6rem;
}
</style>