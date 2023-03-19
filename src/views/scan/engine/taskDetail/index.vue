<template>
  <a-row>
    <a-col>
      <a-tag checkable color="#0fc6c2" :default-checked="true"
        >消息总数：{{ props.nsqInfo.message_count }}</a-tag
      >
      <a-tag checkable color="#00b42a" :default-checked="true"
        >消息大小：{{ props.nsqInfo.message_bytes }}</a-tag
      >
      <a-tag checkable color="#168cff" :default-checked="true"
        >客户端数：{{ props.nsqInfo.client_count }}</a-tag
      >
      <a-tag checkable color="#ffb400" :default-checked="true"
        >超时消息：{{ props.nsqInfo.timeout_count }}</a-tag
      >
    </a-col>
  </a-row>
  <a-table :columns="columns" :data="props.nsqInfo.data" />
</template>

<script lang="ts" setup>
  import { NsqInfo } from '@/api/engine';

  const props = defineProps({
    nsqInfo: {
      type: Object as () => NsqInfo,
      required: true,
    },
  });
  const columns = [
    {
      title: '客户端',
      dataIndex: 'hostname',
    },
    {
      title: 'IP地址',
      dataIndex: 'remote_address',
    },
    {
      title: '消息数',
      dataIndex: 'message_count',
    },
    {
      title: '已处理',
      dataIndex: 'finish_count',
    },
    {
      title: '连接时间',
      dataIndex: 'connect_ts',
    },
  ];
</script>

<style scoped></style>
