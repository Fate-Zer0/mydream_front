<template>
	<div
		class="drawer drawer-mobile min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
	>
		<!-- 抽屉开关 -->
		<input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col">
			<!-- 顶部导航栏 -->
			<Header />

			<!-- 主体内容 -->
			<div class="container mx-auto mt-8 px-4 pb-8">
				<!-- 页面标题 -->
				<div class="mb-8 text-center">
					<h1
						class="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
					>
						个人信息
					</h1>
					<p class="text-gray-600">管理你的个人资料和偏好设置</p>
				</div>

				<!-- 主要内容区域 -->
				<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<!-- 左侧头像展示卡片 -->
					<div class="lg:col-span-1">
						<div
							class="card sticky top-8 border border-white/20 bg-gradient-to-br from-white to-indigo-50/50 shadow-2xl backdrop-blur-sm"
						>
							<div class="card-body items-center p-8 text-center">
								<!-- 头像区域 -->
								<div class="avatar indicator mb-6">
									<div
										class="ring-primary ring-offset-base-100 hover:ring-secondary h-32 w-32 rounded-full shadow-xl ring-4 ring-offset-4 transition-all duration-500 hover:scale-110 hover:shadow-2xl"
									>
										<img
											:src="
												profileData.user.user_img
													.file_url ||
												'https://picsum.photos/200'
											"
											alt="用户头像"
											class="h-full w-full rounded-full object-cover transition-all duration-300 hover:brightness-110"
										/>
									</div>
									<!-- 在线状态指示器 -->
									<span
										class="indicator-item badge badge-success h-6 w-6 animate-pulse rounded-full border-2 border-white"
									></span>
								</div>

								<!-- 用户名显示 -->
								<h2
									class="mb-2 text-2xl font-bold text-gray-800"
								>
									{{ profileData.user.user_name || "用户名" }}
								</h2>

								<!-- 个性签名显示 -->
								<p
									class="mb-4 min-h-[1.5rem] text-sm italic text-gray-600"
								>
									{{
										profileData.user_grjj ||
										"还没有个性签名~"
									}}
								</p>

								<!-- 用户统计 -->
								<div
									class="stats stats-vertical w-full rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 shadow-lg"
								>
									<div class="stat py-3">
										<div
											class="stat-figure text-indigo-500"
										>
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100"
											>
												<span class="text-sm">📅</span>
											</div>
										</div>
										<div
											class="stat-title text-xs text-gray-600"
										>
											注册时间
										</div>
										<div
											class="stat-value text-sm font-bold text-indigo-600"
										>
											{{
												formatDate(
													profileData.user_create_date,
												)
											}}
										</div>
									</div>
									<div class="stat py-3">
										<div
											class="stat-figure text-emerald-500"
										>
											<div
												class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100"
											>
												<span class="text-sm">⭐</span>
											</div>
										</div>
										<div
											class="stat-title text-xs text-gray-600"
										>
											积分
										</div>
										<div
											class="stat-value text-sm font-bold text-emerald-600"
										>
											{{ profileData.user_points || 0 }}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 右侧编辑表单 -->
					<div class="lg:col-span-2">
						<div
							class="card border border-white/20 bg-gradient-to-br from-white to-gray-50/50 shadow-2xl backdrop-blur-sm"
						>
							<div class="card-body p-8">
								<h3
									class="mb-6 flex items-center gap-3 text-2xl font-bold text-gray-800"
								>
									<span
										class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100"
									>
										✏️
									</span>
									编辑资料
								</h3>

								<form
									@submit.prevent="handleSubmit"
									class="space-y-6"
								>
									<!-- 头像上传 -->
									<div class="form-control">
										<label class="label">
											<span
												class="label-text flex items-center gap-2 text-base font-semibold text-gray-700"
											>
												<span>📸</span> 头像
											</span>
										</label>
										<div class="flex items-center gap-4">
											<div class="avatar">
												<div
													class="h-16 w-16 rounded-full ring-2 ring-gray-200"
												>
													<img
														:src="
															profileData.user
																.user_img
																.file_url ||
															'https://picsum.photos/200'
														"
														alt="预览头像"
													/>
												</div>
											</div>
											<div class="flex-1">
												<input
													type="file"
													ref="avatarInput"
													@change="handleAvatarChange"
													accept="image/*"
													class="file-input file-input-bordered file-input-primary w-full rounded-xl"
												/>
												<p
													class="mt-1 text-sm text-gray-500"
												>
													支持 JPG、PNG
													格式，大小不超过 2MB
												</p>
											</div>
										</div>
									</div>

									<!-- 用户名 -->
									<div class="form-control">
										<label class="label">
											<span
												class="label-text flex items-center gap-2 text-base font-semibold text-gray-700"
											>
												<span>👤</span> 用户名
											</span>
										</label>
										<input
											type="text"
											v-model="profileData.user.user_name"
											placeholder="请输入用户名"
											class="input input-bordered input-primary w-full rounded-xl transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
											maxlength="20"
										/>
										<label class="label">
											<span
												class="label-text-alt text-gray-500"
												>{{
													profileData.user.user_name
														?.length || 0
												}}/20</span
											>
										</label>
									</div>

									<!-- 性别选择 -->
									<div class="form-control">
										<label class="label">
											<span
												class="label-text flex items-center gap-2 text-base font-semibold text-gray-700"
											>
												<span>⚧️</span> 性别
											</span>
										</label>

										<!-- 性别类型选择 -->
										<div class="mb-4">
											<div
												class="grid grid-cols-1 gap-3 sm:grid-cols-3"
											>
												<div
													v-for="category in genderCategories"
													:key="category.id"
													@click="
														selectGenderCategory(
															category.id,
														)
													"
													class="group relative cursor-pointer"
													:class="[
														'rounded-2xl border-2 p-4 transition-all duration-300',
														selectedGenderCategory ==
														category.id
															? 'scale-105 transform border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
															: 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:scale-105 hover:border-indigo-300',
													]"
												>
													<div
														class="flex flex-col items-center text-center"
													>
														<div
															class="mb-2 text-3xl transition-transform duration-200 group-hover:scale-110"
														>
															{{ category.icon }}
														</div>
														<h4
															class="font-bold text-gray-800 transition-colors group-hover:text-indigo-600"
														>
															{{ category.name }}
														</h4>
														<p
															class="mt-1 text-sm text-gray-500"
														>
															{{
																category.description
															}}
														</p>
													</div>
													<!-- 选中指示器 -->
													<div
														v-if="
															selectedGenderCategory ==
															category.id
														"
														class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 shadow-lg"
													>
														<span
															class="text-sm text-white"
															>✓</span
														>
													</div>
												</div>
											</div>
										</div>

										<!-- 具体性别选择 -->
										<div
											v-if="selectedGenderCategory"
											class="space-y-3"
										>
											<h5
												class="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-600"
											>
												<span>{{
													getCurrentCategoryName()
												}}</span>
												<span
													class="rounded-full bg-gray-100 px-2 py-1 text-xs"
													>选择具体性别</span
												>
											</h5>
											<div
												class="grid grid-cols-1 gap-3 sm:grid-cols-2"
											>
												<label
													v-for="gender in getCurrentGenderOptions()"
													:key="gender.id"
													class="gender-option group relative cursor-pointer"
												>
													<input
														type="radio"
														:value="gender.id"
														v-model="
															profileData.user_sex_code
														"
														class="sr-only"
													/>
													<div
														class="rounded-xl border-2 p-4 transition-all duration-300"
														:class="[
															profileData.user_sex_code ===
															gender.id
																? getSelectedGenderStyle()
																: 'border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:scale-[1.02] hover:border-gray-300 hover:shadow-md',
														]"
													>
														<div
															class="flex items-center justify-between"
														>
															<div
																class="flex items-center gap-3"
															>
																<div
																	class="text-2xl transition-transform duration-200 group-hover:scale-110"
																>
																	{{
																		gender.symbol
																	}}
																</div>
																<div>
																	<div
																		class="font-semibold text-gray-800 transition-colors group-hover:text-indigo-600"
																	>
																		{{
																			gender.name
																		}}
																	</div>
																	<div
																		class="mt-1 text-sm text-gray-500"
																		v-if="
																			gender.description
																		"
																	>
																		{{
																			gender.description
																		}}
																	</div>
																</div>
															</div>
															<!-- 选中指示器 -->
															<div
																v-if="
																	profileData.user_sex_code ===
																	gender.id
																"
																class="flex h-5 w-5 items-center justify-center rounded-full shadow-lg"
																:class="
																	getSelectedIndicatorStyle()
																"
															>
																<span
																	class="text-xs text-white"
																	>✓</span
																>
															</div>
														</div>
													</div>
												</label>
											</div>
										</div>

										<!-- 未选择提示 -->
										<div
											v-else
											class="py-8 text-center text-gray-400"
										>
											<div class="mb-2 text-4xl">🤔</div>
											<p class="text-sm">
												请先选择一个性别类型
											</p>
										</div>
									</div>

									<!-- 个性签名 -->
									<div class="form-control">
										<label class="label">
											<span
												class="label-text flex items-center gap-2 text-base font-semibold text-gray-700"
											>
												<span>✨</span> 个性签名
											</span>
										</label>
										<textarea
											v-model="profileData.user_grjj"
											placeholder="写下你的个性签名，让别人更了解你..."
											class="textarea textarea-bordered textarea-primary h-24 w-full resize-none rounded-xl transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
											maxlength="100"
										></textarea>
										<label class="label">
											<span
												class="label-text-alt text-gray-500"
												>{{
													profileData.user_grjj
														?.length || 0
												}}/100</span
											>
										</label>
									</div>

									<!-- 操作按钮 -->
									<div class="flex gap-4 pt-6">
										<button
											type="submit"
											:disabled="isSaving"
											class="btn flex-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
										>
											<span
												:class="{
													'loading loading-spinner':
														isSaving,
												}"
											>
												{{
													isSaving
														? "保存中..."
														: "💾 保存修改"
												}}
											</span>
										</button>
										<button
											type="button"
											@click="resetForm"
											class="btn btn-outline btn-primary flex-1 rounded-2xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl"
										>
											🔄 重置
										</button>
									</div>
								</form>
							</div>
						</div>

						<!-- 危险操作区域 -->
						<div
							class="card mt-6 border border-red-200 bg-gradient-to-br from-red-50/50 to-white shadow-xl"
						>
							<div class="card-body p-6">
								<h3
									class="mb-4 flex items-center gap-3 text-xl font-bold text-red-600"
								>
									<span
										class="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100"
									>
										⚠️
									</span>
									危险操作
								</h3>
								<p class="mb-4 text-gray-600">
									以下操作将会永久性地影响您的账户，请谨慎操作。
								</p>
                <div class="flex gap-3">
                  <button
                      class="btn btn-outline btn-info rounded-xl"
                      onclick="location.href='/securityQuestion'"
                  >
                    ⚙️ 设置密保
                  </button>
                  <button
                      class="btn btn-outline btn-warning rounded-xl"
                  >
                    🔐 修改密码
                  </button>
                  <button
                      class="btn btn-outline btn-error rounded-xl"
                  >
                    🗑️ 删除账户
                  </button>
                </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 侧边抽屉菜单 -->
		<SideDrawer :menu-items="menuItems" />

		<!-- 成功提示弹窗 -->
		<div
			v-if="showSuccessAlert"
			class="alert alert-success alert-top-fixed animate-slide-down shadow-2xl"
		>
			<div class="flex items-center">
				<span class="mr-3 text-2xl">✅</span>
				<div>
					<h3 class="font-bold">保存成功！</h3>
					<div class="text-sm opacity-90">您的个人信息已更新</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import Header from "../components/homeHead.vue";
import SideDrawer from "../components/homeSideDrawer.vue";
import { useUserStore } from "../../ts/stores/user";
import { withRequest } from "../../ts/composables/useRequest";
import api from "../../ts/api/api";
import type {UserInfo} from "../../ts/type/UserInfo";
import {useAlertStore} from "../../ts/stores/alert";

const userStore = useUserStore();

// 菜单项
const menuItems = [
	{ title: "首页", href: "/home", icon: "🏠" },
	{ title: "留言板", href: "/messageBoard", icon: "📊" },
	{ title: "系统设置", href: "/settings", icon: "⚙️" },
	{ title: "帮助支持", href: "/help", icon: "❓" },
];

// 表单数据
const profileData = reactive<UserInfo>({
	user: userStore.getUser(),
	user_create_date: "",
	last_sign_in_date: "",
	user_points: "",
	user_sex_code: "",
	user_sex_name: "",
	user_grjj: "",
});

// 性别选择相关
const selectedGenderCategory = ref(null);

// 性别类型数据
const genderCategories = ref([
	{
		id: "51000",
		name: "传统",
		icon: "👥",
		description: "传统性别认知",
	},
	{
		id: "52000",
		name: "多元化",
		icon: "🌈",
		description: "多元性别认知",
	},
	{
		id: "53000",
		name: "传奇",
		icon: "✨",
		description: "特殊性别选项",
	},
]);

// 具体性别数据
const genderOptions = ref([
	// 传统
	{
		id: "51001",
		categoryId: "51000",
		name: "男",
		symbol: "♂",
		description: "",
	},
	{
		id: "51002",
		categoryId: "51000",
		name: "女",
		symbol: "♀",
		description: "",
	},
	// 多元化
	{
		id: "52001",
		categoryId: "52000",
		name: "双性",
		symbol: "⚤",
		description: "生理上同时具有男性和女性特征的个体",
	},
	{
		id: "52002",
		categoryId: "52000",
		name: "酷儿",
		symbol: "🏳️‍🌈",
		description: "女性个体表现出传统上与男性相关联的行为特征",
	},
	{
		id: "52003",
		categoryId: "52000",
		name: "两性",
		symbol: "⚥",
		description: "个体在不同时间或情境下可能认同为男性或女性",
	},
	{
		id: "52004",
		categoryId: "52000",
		name: "无性",
		symbol: "○",
		description: "个体不认同于任何性别",
	},
	{
		id: "52005",
		categoryId: "52000",
		name: "性别流动",
		symbol: "🌊",
		description: "个体的性别认同可能随时间或情境而改变",
	},
	// 传奇
	{
		id: "53001",
		categoryId: "53000",
		name: "一个",
		symbol: "1️⃣",
		description: "我是一个一个一个...",
	},
	{
		id: "53002",
		categoryId: "53000",
		name: "武装直升机",
		symbol: "🚁",
		description: "哼 想逃?",
	},
]);

// 原始数据备份（用于重置）
const originalData = reactive<UserInfo>({
	user: null,
	user_create_date: "",
	last_sign_in_date: "",
	user_points: "",
	user_sex_code: "",
	user_sex_name: "",
	user_grjj: "",
});

// 状态管理
const isSaving = ref(false);
const showSuccessAlert = ref(false);
const avatarInput = ref(null);

// 初始化数据
onMounted(() => {
	// 模拟从后端获取用户数据
	loadUserProfile();
});

// 加载用户资料
const loadUserProfile = async (): Promise<void> => {
	const userData = await getUserInfoByUserid(userStore.getUserid());
	userStore.setUserInfo(
		userData.user.user_id,
		userData.user.user_name,
		userData.user.user_img,
	);
	userStore.setStorageUser();
	Object.assign(profileData, userData);
	Object.assign(originalData, userData);

	// 根据已选择的性别设置类型
	if (profileData.user_sex_code) {
		const selectedGender = genderOptions.value.find(
			(g) => g.id === profileData.user_sex_code,
		);
		if (selectedGender) {
			selectedGenderCategory.value = selectedGender.categoryId;
		}
	}
};

async function getUserInfoByUserid(userid?: string) {
	if (!userid) return;
	const res = await withRequest(() => api.account.user.getUserInfo(userid));
	if (res?.retValue) {
		return res.retValue;
	}
}

// 选择性别类型
function selectGenderCategory(categoryId) {
	selectedGenderCategory.value = categoryId;
	// 清空已选择的具体性别（如果不属于当前类型）
	if (profileData.user_sex_code) {
		const currentGender = genderOptions.value.find(
			(g) => g.id === profileData.user_sex_code,
		);
		if (!currentGender || currentGender.categoryId !== categoryId) {
			profileData.user_sex_code = "";
		}
	}
}

// 获取当前类型的性别选项
function getCurrentGenderOptions() {
	if (!selectedGenderCategory.value) return [];
	return genderOptions.value.filter(
		(g) => g.categoryId == selectedGenderCategory.value,
	);
}

// 获取当前类型名称
function getCurrentCategoryName() {
	const category = genderCategories.value.find(
		(c) => c.id == selectedGenderCategory.value,
	);
	return category ? category.name : "";
}

// 获取选中性别的样式
function getSelectedGenderStyle() {
	const categoryId = selectedGenderCategory.value;
	switch (categoryId) {
		case 51000: // 传统
			return "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg transform scale-[1.02]";
		case 52000: // 多元化
			return "border-purple-500 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 shadow-lg transform scale-[1.02] rainbow-glow";
		case 53000: // 传奇
			return "border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg transform scale-[1.02] legendary-glow";
		default:
			return "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg transform scale-[1.02]";
	}
}

// 获取选中指示器样式
function getSelectedIndicatorStyle() {
	const categoryId = selectedGenderCategory.value;
	switch (categoryId) {
		case 51000: // 传统
			return "bg-blue-500";
		case 52000: // 多元化
			return "bg-purple-500";
		case 53000: // 传奇
			return "bg-yellow-500";
		default:
			return "bg-indigo-500";
	}
}

// 处理头像上传
async function handleAvatarChange(event) {
	const file = event.target.files[0];
	if (!file) return;

	// 文件大小检查
	if (file.size > 2 * 1024 * 1024) {
		useAlertStore().showAlertWithAutoHide(
			"alert-warning",
			"文件大小不能超过 2MB!",
		);
		return;
	}

	// 文件类型检查
	if (!file.type.startsWith("image/")) {
		useAlertStore().showAlertWithAutoHide(
			"alert-warning",
			"请选择图片文件",
		);
		return;
	}

	try {
		const userId = useUserStore().getUserid();
		const res = await api.account.user.updateUserImg(userId, file);

    if (res.retCode === "0000") {
      const n_file = res.retValue;
      // 本地预览
      const reader = new FileReader();
      reader.onload = (e) => {
        if (profileData?.user?.user_img) {
          profileData.user.user_img.file_url = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
      userStore.setUserimg(n_file);
      userStore.setStorageUser();
      useAlertStore().showAlertWithAutoHide("alert-success", "成功: 头像修改成功!");
    } else {
      useAlertStore().showAlertWithAutoHide("alert-danger", "失败: 请联系管理员!");
    }

  } catch (error) {
    useAlertStore().showAlertWithAutoHide("alert-danger", "网络异常，请稍后重试");
  }
}

// 提交表单
async function handleSubmit() {
	// 表单验证
	if (
		!profileData.user.user_name ||
		profileData.user.user_name.trim().length == 0
	) {
		alert("请输入用户名");
		return;
	}

	if (profileData.user.user_name.length > 20) {
		alert("用户名不能超过20个字符");
		return;
	}

	if (profileData.user_grjj && profileData.user_grjj.length > 100) {
		alert("个性签名不能超过100个字符");
		return;
	}

	isSaving.value = true;

	try {
		const res = await withRequest(() =>
			api.account.user.updateUserInfo(profileData),
		);
		if (res.retCode == "0000") {
			// 更新原始数据
			Object.assign(originalData, { ...profileData });
			userStore.setUsername(profileData.user.user_name);
			// 显示成功提示
			useAlertStore().showAlertWithAutoHide(
				"alert-success",
				"成功: 修改成功!",
			);
		} else {
			useAlertStore().showAlertWithAutoHide(
				"alert-danger",
				"失败: 请联系管理员!",
			);
		}
	} catch (error) {
		useAlertStore().showAlertWithAutoHide(
			"alert-danger",
			"失败: 请联系管理员!",
		);
	} finally {
		isSaving.value = false;
	}
}

// 重置表单
function resetForm() {
	Object.assign(profileData, { ...originalData });
	// 重置性别类型选择
	if (profileData.user_sex_code) {
		const selectedGender = genderOptions.value.find(
			(g) => g.id === profileData.user_sex_code,
		);
		if (selectedGender) {
			selectedGenderCategory.value = selectedGender.categoryId;
		}
	} else {
		selectedGenderCategory.value = null;
	}
	if (avatarInput.value) {
		avatarInput.value.value = "";
	}
}

// 格式化日期
function formatDate(date) {
	if (!date) return "-";
	const d = new Date(date);
	return d.toLocaleDateString("zh-CN");
}
</script>

<style scoped>
@import "../../css/main/MyInfo.css";
</style>
