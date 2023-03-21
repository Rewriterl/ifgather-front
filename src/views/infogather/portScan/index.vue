<template>
  <div class="container">
    <Breadcrumb :items="['menu.ifgather', 'menu.infogather.portscan']" />
    <a-card class="general-card" :title="$t('menu.list.searchTable')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 16 }"
            label-align="left"
          >
            <a-row>
              <a-col>
                <a-form-item
                  field="searchParams"
                  :label="$t('searchTable.scan.name')"
                >
                  <a-input
                    v-model="formModel.searchParams.cusname"
                    :placeholder="$t('searchTable.scan.name')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 44px" direction="vertical" />
        <a-col :flex="'46px'" style="text-align: right">
          <a-space direction="horizontal" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button :type="'primary'" :status="'normal'" @click="handleClick">
              <template #icon>
                <icon-plus />
              </template>
              添加任务
            </a-button>
            <a-popconfirm
              content="清空任务并不会终止正在进行的任务，如需清除推荐在任务完成后进行"
              @ok="delAllTask()"
            >
              <a-button :status="'danger'">
                <template #icon>
                  <icon-delete />
                </template>
                清空任务
              </a-button>
            </a-popconfirm>
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search">
              <icon-refresh size="18" />
            </div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon">
                <icon-line-height size="18" />
              </div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon">
                <icon-settings size="18" />
              </div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            :shape="'square'"
            :status="'normal'"
            @click="handleDetailsClick(record.cus_name)"
          >
            查看详情
          </a-button>
          <a-popconfirm
            :type="'warning'"
            content="真删？"
            @ok="delTask(record.cus_name)"
          >
            <a-button
              type="text"
              :shape="'square'"
              size="small"
              :status="'danger'"
            >
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-modal
        v-model:visible="visible"
        title="Modal Form"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item
            field="CusName"
            label="任务名"
            tooltip="若追加已有任务,请填写该任务名。如果有多个扫描任务同时运行，则不保证消息队列顺序(消息发送是随机的)"
          >
            <a-input v-model="form.CusName" />
          </a-form-item>
          <a-form-item
            field="Hosts"
            label="主机地址"
            tooltip="可添加多行,支持CIDR格式,自动去重处理"
          >
            <a-textarea v-model="form.Hosts" />
          </a-form-item>
          <a-form-item
            field="Ports"
            label="端口"
            tooltip="格式：80(单端口)、21,22,23(指定多个端口)、1-100(端口范围)、top100(内置top100端口)、top1000(内置top1000端口)、full(全部端口)"
          >
            <a-input v-model="form.Ports" />
          </a-form-item>
          <a-form-item
            field="Rate"
            label="扫描速率"
            tooltip="扫描速率过大会导致扫描结果不全,外网扫描建议不超过2000"
          >
            <a-input-number v-model="form.Rate" />
          </a-form-item>
          <a-form-item field="Timeout" label="探测超时" tooltip="默认为10s">
            <a-input-number v-model="form.Timeout" />
          </a-form-item>
          <a-form-item field="Ping" label="存活探测">
            <a-switch v-model="form.Ping">
              <template #checked> ON </template>
              <template #unchecked> OFF </template>
            </a-switch>
          </a-form-item>
          <a-form-item
            field="Detection"
            label="优先探测"
            tooltip="对于禁ping扫描，会扫描所有主机(不管是否存活),会浪费大量时间，可使用优先探测top100或top1000端口进行存活扫描"
          >
            <a-input v-model="form.Detection" />
          </a-form-item>
          <a-form-item
            field="NmapTimeout"
            label="指纹超时"
            tooltip="指纹识别超时默认为7s"
          >
            <a-input-number v-model="form.NmapTimeout" />
          </a-form-item>
          <a-form-item
            field="WafNum"
            label="WAF过滤"
            tooltip="默认单个主机超过50个端口开放则判定为waf，不继续探测"
          >
            <a-input-number v-model="form.WafNum" />
          </a-form-item>
          <a-form-item
            field="Retries"
            label="重试次数"
            tooltip="若超时则重新探测"
          >
            <a-input-number v-model="form.Retries" />
          </a-form-item>
          <a-form-item field="Verify" label="二次验证">
            <a-switch v-model="form.Verify">
              <template #checked> ON </template>
              <template #unchecked> OFF </template>
            </a-switch>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-split />
      <TaskDetail :nsq-info="portScanTask" nsq-id="port" />
      <a-drawer
        :width="'70%'"
        :visible="drawerVisible"
        :footer="false"
        @cancel="handleDrawerCancel"
        unmountOnClose
      >
        <template #header>
          <span>子域名扫描详情</span>
        </template>
        <portscan-detail :taskname="taskname" />
      </a-drawer>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { Params, LoginLogRecord } from '@/api/manager';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    addPortScanTask,
    delAllPortScanTask,
    delPortScanTask,
    getPortScanTask,
  } from '@/api/port';
  import TaskDetail from '@/views/scan/engine/taskDetail/index.vue';
  import { getNsqInfo, NsqInfo } from '@/api/engine';
  import { Message } from '@arco-design/web-vue';
  import PortscanDetail from '@/views/infogather/portScan/portscanDetail/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const generateFormModel = () => {
    return {
      searchParams: {
        cusname: '',
      },
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<LoginLogRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    page: 1,
    limit: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const portScanTask = ref<NsqInfo>({} as NsqInfo);
  const fetchPortScanNsqInfo = async () => {
    setLoading(true);
    try {
      const data: any = await getNsqInfo('portscan');
      portScanTask.value = data;
    } finally {
      setLoading(false);
    }
  };
  fetchPortScanNsqInfo();
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('searchTable.columns.name'),
      dataIndex: 'cus_name',
    },
    {
      title: t('searchTable.columns.host_num'),
      dataIndex: 'host_num',
    },
    {
      title: t('searchTable.columns.scan_num'),
      dataIndex: 'scan_num',
    },
    {
      title: t('searchTable.columns.createdTime'),
      dataIndex: 'create_at',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const fetchData = async (
    params: Params = { page: 1, limit: 10, searchParams: '' }
  ) => {
    setLoading(true);
    try {
      const data: any = await getPortScanTask(params);
      renderData.value = data.data;
      pagination.page = params.page;
      pagination.total = data.count;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    const searchParams = JSON.stringify(formModel.value.searchParams);
    fetchData({
      ...basePagination,
      searchParams,
    } as unknown as Params);
  };
  const onPageChange = (page: number) => {
    fetchData({ ...basePagination, page });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
  };

  const exchangeArray = <T extends Array<any>>(
    array: T,
    beforeIdx: number,
    newIdx: number,
    isDeep = false
  ): T => {
    const newArray = isDeep ? cloneDeep(array) : array;
    if (beforeIdx > -1 && newIdx > -1) {
      // 先替换后面的，然后拿到替换的结果替换前面的
      newArray.splice(
        beforeIdx,
        1,
        newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
      );
    }
    return newArray;
  };

  const popupVisibleChange = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            exchangeArray(cloneColumns.value, oldIndex, newIndex);
            exchangeArray(showColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  const visible = ref(false);
  const form = reactive({
    CusName: '',
    Hosts: '',
    Verify: false,
    Ping: false,
    Retries: 1,
    Rate: 1000,
    Timeout: 1000,
    Ports: 'top100',
    NmapTimeout: 7,
    WafNum: 50,
    Detection: 'null',
  });

  const clearForm = () => {
    form.CusName = '';
    form.Hosts = '';
    form.Verify = false;
    form.Ping = false;
    form.Retries = 1;
    form.Rate = 1000;
    form.Timeout = 1000;
    form.Ports = 'top100';
    form.NmapTimeout = 7;
    form.WafNum = 50;
    form.Detection = 'null';
  };

  const addTask = async () => {
    try {
      const data: any = await addPortScanTask(form);
      Message.success(data.msg);
    } finally {
      visible.value = false;
      clearForm();
      await fetchData();
      setLoading(false);
    }
  };

  const handleClick = () => {
    visible.value = true;
  };
  const handleBeforeOk = () => {
    addTask();
    fetchData();
    return true;
  };
  const handleCancel = () => {
    visible.value = false;
  };
  const taskname = ref('');
  const drawerVisible = ref(false);

  const handleDrawerClick = () => {
    drawerVisible.value = true;
  };

  const handleDrawerCancel = () => {
    drawerVisible.value = false;
  };

  const handleDetailsClick = (cusName: string) => {
    taskname.value = cusName;
    handleDrawerClick();
  };

  const delAllTask = async () => {
    setLoading(true);
    try {
      const data: any = await delAllPortScanTask();
      Message.success(data.msg);
      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  const delTask = async (cusName: string) => {
    setLoading(true);
    try {
      const data: any = await delPortScanTask(cusName);
      Message.success(data.msg);
      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'Port',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
