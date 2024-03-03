<template>
    <div class="box">
        <div class="left">
            <!-- logo -->
            <div class="logo">
                <img src="../assets/logo.png" alt="" />
                <div class="logoName">{{ cnname }}</div>
            </div>
            <div class="block text-center">
                <el-carousel arrow="never">
                    <el-carousel-item v-for="item in imgs" :key="item">
                        <div class="imgs">
                            <img :src="item" alt="" />
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
        <div class="right">
            <div class="login">
                <div class="title">欢迎回来</div>
                <div class="form">
                    <div class="demo-input-size">
                        <el-input v-model="input1" class="input" size="large" placeholder="用户名 / 手机号" :suffix-icon="User" />
                        <el-input v-model="input2" show-password class="input" size="large" placeholder="用户密码"
                            :suffix-icon="Lock" @keydown.enter="login" />
                        <div class="select">
                            <el-checkbox class="check" label="记住密码" v-model="checked" name="type" size="small" />
                            <div class="flaot" @click="forget">忘记密码?</div>
                            <div class="resign" @click="register">注册新账号</div>
                        </div>
                    </div>
                    <div>
                        <el-button class="btn" type="primary" @click="login" round>登录</el-button>
                    </div>
                </div>
            </div>
            <div>
                <!-- 注册页面 -->
                <el-drawer v-model="dialog" direction="rtl" size="700">
                    <div v-show="!isShow">
                        <div class="register">
                            <div class="title">注册账号</div>
                            <div class="form">
                                <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                                    class="demo-ruleForm">
                                    <el-form-item label="用户名" prop="userName">
                                        <el-input v-model="ruleForm.userName" class="input" type="text"
                                            autocomplete="off" />
                                    </el-form-item>
                                    <el-form-item label="手机号" prop="phone">
                                        <el-input v-model="ruleForm.phone" class="input" type="text" autocomplete="off" />
                                    </el-form-item>
                                    <el-form-item label="密码" prop="passWord">
                                        <el-input v-model.number="ruleForm.passWord" class="input" type="text"
                                            autocomplete="off" />
                                    </el-form-item>
                                    <el-form-item class="btn">
                                        <el-button class="submitBtn" type="primary"
                                            @click="submitForm(ruleFormRef)">提交</el-button>
                                        <el-button class="ruleBtn" @click="resetForm(ruleFormRef)">重置</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div class="care">
                            <div>注意：</div>
                            <div>1. 用户名必须由字母组成，且不超过12位！</div>
                            <div>2. 密码必须包含字母和数字且由字母开头！</div>
                        </div>
                    </div>

                    <div v-show="isShow">
                        <div class="register">
                            <div class="title">重置密码</div>
                            <div class="form">
                                <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                                    class="demo-ruleForm">
                                    <el-form-item label="用户名" prop="userName">
                                        <el-input v-model="ruleForm.userName" class="input" type="text"
                                            autocomplete="off" />
                                    </el-form-item>
                                    <el-form-item label="手机号" prop="phone">
                                        <el-input v-model="ruleForm.phone" class="input" type="text" autocomplete="off" />
                                    </el-form-item>
                                    <el-form-item label="新密码" prop="passWord">
                                        <el-input v-model.number="ruleForm.passWord" class="input" type="text"
                                            autocomplete="off" />
                                    </el-form-item>
                                    <el-form-item class="btn">
                                        <el-button class="submitBtn" type="primary"
                                            @click="submitForm(ruleFormRef)">提交</el-button>
                                        <el-button class="ruleBtn" @click="resetForm(ruleFormRef)">重置</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                        <div class="care">
                            <div>注意：</div>
                            <div>1. 用户名和手机号必须与原用户名和手机号相同！</div>
                            <div>2. 密码必须包含字母和数字且由字母开头！</div>
                        </div>
                    </div>
                </el-drawer>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from "axios"
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { Lock, User, Iphone } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useCounterStore } from "../store/counter";
import router from '../router/index';
export default defineComponent({
    setup() {
        const imgs = <Array<string>>[
            require("../assets/item1.png"),
            require("../assets/item2.png"),
            require("../assets/item3.png"),
            require("../assets/item4.png"),
        ];

        // 抽屉展开状态
        const dialog = ref(false)
        const input1 = ref('')
        const input2 = ref('')
        // 是否显示
        const isShow = ref(false)
        // 点击对象
        const nums = ref(0)

        const checked = ref(false)
        const counterStore = useCounterStore();
        const cnname = computed(() => counterStore.cnname);

        onMounted(() => {
            const data = localStorage.getItem('node') || "{}"
            if (localStorage.getItem('node') !== '{}') {
                const node = JSON.parse(data)
                input1.value = node.username
                input2.value = node.password
                checked.value = true
            }

        })


        const login = (): void => {
            if (input1.value == '' || input2.value == '') {
                ElMessage.error("账号或密码不能为空！！！")
                return
            }
            console.log(input1.value, input2.value);

            axios.post('http://192.168.37.77:8520/login', {
                username_or_phone: input1.value,
                password: input2.value,
            })
                .then(res => {

                    console.log("登录成功");

                    // console.log(res)
                    if (res.data.status == 'ok') {
                        ElMessage({
                            message: res.data.message,
                            type: 'success',
                        })
                        let token = res.data.access_token
                        let userId = res.data.user_id

                        if (checked.value) {
                            let node = {
                                username:input1.value,
                                password: input2.value
                            }
                            localStorage.setItem('token', token);
                            localStorage.setItem("node", JSON.stringify(node))
                        } else {
                            localStorage.setItem("node", '{}')
                            sessionStorage.setItem('token', token);
                        }
                        // localStorage.setItem('userId',userId)
                        localStorage.setItem("G_USER", JSON.stringify({ id: userId, user: res.data.username }))

                        // 跳转至首页
                        setTimeout(() => {
                            router.push({ name: 'home' })
                        }, 300)
                    }
                    if (res.data.status == 'error') {
                        ElMessage.error(res.data.message)
                    }

                })
                .catch(err => {
                    console.log(err);
                })
        }
        // 忘记密码
        const forget = () => {
            ruleForm.userName = ''
            ruleForm.phone = ''
            ruleForm.passWord = ''
            dialog.value = true
            isShow.value = true
        }
        // 注册新账号
        const register = () => {
            ruleForm.userName = ''
            ruleForm.phone = ''
            ruleForm.passWord = ''
            dialog.value = true
            isShow.value = false
            nums.value = 1
        }

        const ruleFormRef = ref<FormInstance>()

        const ruleForm = reactive({
            userName: '',
            phone: '',
            passWord: '',
        })

        const rules = reactive<FormRules<typeof ruleForm>>({
            userName: [
                { required: true, type: 'string', message: "用户名不能为空", trigger: "blur" },
                { pattern: /^[a-zA-Z0-9]{1,12}$/, message: "用户名格式错误", trigger: "blur" },
            ],
            phone: [
                { required: true, message: "手机号不能为空", trigger: "blur" },
                { pattern: /^1[3|4|5|8|9]{1}[0-9]{9}$/, message: "手机号格式错误", trigger: "blur" },
            ],
            passWord: [
                { required: true, message: "密码不能为空", trigger: "blur" },
                { pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,12}$/, message: "密码格式错误", trigger: "blur" },
            ],
        })

        const submitForm = (formEl: FormInstance | undefined) => {
            if (!formEl) return
            formEl.validate((valid: any) => {
                if (valid) {
                    console.log(ruleForm)
                    // 如果是注册新账号
                    if (nums.value == 1) {
                        axios.post('http://192.168.37.77:8520/register', {
                            username: ruleForm.userName,
                            phone_number: ruleForm.phone,
                            password: ruleForm.passWord,
                        })
                            .then(res => {
                                console.log(res)
                                if (res.status == 201) {
                                    ElMessage({
                                        message: res.data.message,
                                        type: 'success',
                                    })
                                }
                                ruleForm.userName = ''
                                ruleForm.phone = ''
                                ruleForm.passWord = ''
                                dialog.value = false
                            })
                            .catch(err => {
                                console.log(err);
                                ElMessage.error('用户名或手机号已被注册！')
                            })
                    } else {
                        console.log("忘记密码？？？");
                        axios.post('http://192.168.37.77:8520/forgot_password', {
                            username: ruleForm.userName,
                            phone_number: ruleForm.phone,
                            new_password: ruleForm.passWord,
                        })
                            .then(res => {
                                console.log(res)
                                if (res.data.status == 'ok') {
                                    ElMessage({
                                        message: '重置密码成功！',
                                        type: 'success',
                                    })
                                }
                                if (res.data.status == 'err') {
                                    ElMessage.error('无效的用户名或电话号码，重置密码失败！')
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }

                } else {
                    console.log('error submit!')
                    return false
                }
            })
        }

        const resetForm = (formEl: FormInstance | undefined) => {
            if (!formEl) return
            formEl.resetFields()
        }



        return {
            imgs,
            input1,
            input2,
            Lock,
            User,
            checked,
            cnname,
            Iphone,
            dialog,
            login,
            ruleForm,
            rules,
            submitForm,
            resetForm,
            ruleFormRef,
            forget,
            isShow,
            register,
        }
    }
})
</script>

<style lang="scss" scoped>
.box {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;

    .left {
        width: 50%;
        height: 100vh;

        .logo {
            height: 100px;
            position: absolute;
            top: 50px;
            left: 30px;
            z-index: 1;

            img {
                height: 100%;
            }

            .logoName {
                position: relative;
                top: -90px;
                left: 150px;
                font-size: 30px;
                font-weight: bolder;
            }
        }

        .slide {
            height: 100vh;
            width: 50%;
        }

        .block {
            width: 100%;
            height: 100vh;

            .el-carousel__item:nth-child(2n) {
                background-color: #f8f9ff;
            }

            .el-carousel__item:nth-child(2n + 1) {
                background-color: #fff;
            }

            .el-carousel {
                height: 100vh;

                .el-carousel__item {
                    height: 100vh;

                    .imgs {
                        position: absolute;
                        bottom: 10px;
                    }

                    img {
                        width: calc(100vw / 3);
                    }

                    .el-carousel__indicator {
                        z-index: 1;
                    }
                }
            }
        }
    }

    .right {
        flex: 1;
        height: 100vh;

        .login {
            width: 50%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-content: center;
            flex-direction: column;
            margin: 0 auto;

            .title {
                font-size: 2em;
                font-weight: bold;
                margin: 20px auto;
            }

            .form {
                display: flex;
                flex-direction: column;
                margin: 0 auto;

                .demo-input-size {
                    margin: 10px auto;
                    font-size: 30px !important;
                    padding: 8px;
                    box-sizing: border-box;

                    .input {
                        height: 45px;
                        margin: 10px 0;
                        font-size: 16px;
                    }

                    .select {
                        display: flex;
                        flex-direction: row;
                        margin: 0.5em 0;
                        cursor: pointer;
                        font-size: 12px;
                        line-height: 25px;

                        // 添加，以防止文字压缩
                        >div {
                            width: 60px;
                        }

                        .flaot {
                            margin-left: 13em;
                            display: inline;

                            &:hover {
                                color: #409eff;
                            }
                        }

                        .resign {
                            margin-left: 1em;
                            display: inline;

                            &:hover {
                                color: #409eff;
                            }
                        }
                    }
                }

                .btn {
                    width: 70%;
                    height: 40px;
                    border-radius: 3em;
                    margin-bottom: 30px;
                    flex-direction: row;
                }

                .other {
                    font-size: .5em;
                    margin-bottom: 2em;
                    cursor: pointer;

                    &:hover {
                        color: #409eff;
                    }
                }

                .icon {
                    cursor: pointer;

                    img {
                        width: 2.5em;
                        margin: .5em 1em;
                    }
                }
            }

        }
    }

    .register {
        width: 70%;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        padding: 20px;

        .title {
            font-size: 2em;
            font-weight: bold;
            margin: 20px 0;
        }

        .form {
            margin: 30px 0;
            margin-left: -50px;

            .input {
                height: 40px;
                font-size: 16px;
            }

            .btn {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .submitBtn {
                    width: 100px;
                    border-radius: 20px;
                    margin-top: 20px;
                    margin-left: 50px;
                }

                .ruleBtn {
                    width: 100px;
                    border-radius: 20px;
                    margin-top: 20px;
                    margin-left: 30px;
                }
            }

        }
    }

    .care {
        width: 60%;
        display: block;
        margin: 0 auto;
        text-align: left;
        font-size: 12px;
        color: #666;
    }
}
</style>