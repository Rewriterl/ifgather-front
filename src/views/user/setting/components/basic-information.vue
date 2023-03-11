<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="email"
      :label="$t('userSetting.basicInfo.form.label.email')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.email.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.email"
        :placeholder="$t('userSetting.basicInfo.placeholder.email')"
      />
    </a-form-item>
    <a-form-item
      field="phone"
      :label="$t('userSetting.basicInfo.form.label.phone')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.phone.required'),
        },
      ]"
    >
      <a-input v-model="formData.phone" />
    </a-form-item>
    <a-form-item
      field="nick_name"
      :label="$t('userSetting.basicInfo.form.label.nickname')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.nickname.required'),
        },
      ]"
    >
      <a-input
        v-model="formData.nick_name"
        :placeholder="$t('userSetting.basicInfo.placeholder.nickname')"
      />
    </a-form-item>
    <a-form-item
      field="remark"
      :label="$t('userSetting.basicInfo.form.label.profile')"
      :rules="[
        {
          maxLength: 200,
          message: $t('userSetting.form.error.profile.maxLength'),
        },
      ]"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formData.remark"
        :placeholder="$t('userSetting.basicInfo.placeholder.profile')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validateAndSubmit">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { BasicInfoModel } from '@/api/user-center';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';

  const userStore = useUserStore();
  const formRef = ref<FormInstance>();
  const formData = ref<BasicInfoModel>({
    phone: '',
    email: '',
    nick_name: '',
    remark: '',
  });
  onBeforeMount(() => {
    formData.value.phone = userStore.userInfo.phone || '';
    formData.value.email = userStore.userInfo.email || '';
    formData.value.nick_name = userStore.userInfo.nick_name || '';
    formData.value.remark = userStore.userInfo.remark || '';
  });
  const validateAndSubmit = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      try {
        await userStore.patchUserInfo(formData.value);
        Message.success('修改成功');
      } catch (e: any) {
        console.log(e.message);
      }
    }
  };
  const reset = async () => {
    await formRef.value?.resetFields();
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>
