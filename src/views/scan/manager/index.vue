<template>
  <div class="container">
    <Breadcrumb :items="['menu.scan', 'scan.manager.searchTable']" />
    <a-card class="general-card" :title="$t('menu.list.searchManagerTable')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row>
              <a-col :span="12">
                <a-form-item
                  field="searchParams"
                  :label="$t('searchTable.scan.name')"
                >
                  <a-input
                    v-model="formModel.searchParams"
                    :placeholder="$t('searchTable.scan.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 44px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
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
            <a-button type="primary" @click="handleClick">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
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
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.page - 1) * pagination.limit }}
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            :shape="'square'"
            :status="'normal'"
            @click="handleAssetsClick(record)"
          >
            添加资产
          </a-button>
          <a-button
            type="text"
            :shape="'square'"
            size="small"
            :status="'danger'"
            @click="delManufc(record.cus_name)"
          >
            删除
          </a-button>
        </template>
      </a-table>
      <a-modal
        v-model:visible="visible"
        title="添加厂商"
        @cancel="handleCancel"
        @before-ok="handleBeforeOk"
      >
        <a-form :model="form">
          <a-form-item field="name" label="厂商名">
            <a-input v-model="form.cusName" />
          </a-form-item>
          <a-form-item field="post" label="厂商备注">
            <a-textarea v-model="form.cusRemark" />
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
        v-model:visible="asvisible"
        title="添加资产"
        @cancel="handleAssetsCancel"
        @before-ok="handleAssetsBeforeOk"
      >
        <a-form :model="assetsform">
          <a-form-item field="post" label="域名列表">
            <a-textarea v-model="assetsform.Domain" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
    <a-divider style="margin-top: 0" />
    <DomainSearch />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryManufcList,
    PolicyRecord,
    Params,
    addManufc,
    addDomain,
    domainParams,
    deleteManufc,
  } from '@/api/manager';
  import { Pagination } from '@/types/global';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { Message } from '@arco-design/web-vue';
  import DomainSearch from '@/views/scan/manager/domainSearch/index.vue';

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };

  const visible = ref(false);
  const form = reactive({
    cusName: '',
    cusRemark: '',
  });

  const asvisible = ref(false);
  const assetsform: domainParams = reactive({
    CusName: '',
    Domain: '',
  });

  const addManager = async () => {
    try {
      await addManufc(form);
      Message.success('添加成功');
    } catch (e: any) {
      Message.error(e.message);
    }
  };

  const addManufcDomain = async () => {
    try {
      await addDomain(assetsform);
      Message.success('添加成功');
    } catch (e: any) {
      Message.error(e.message);
    }
  };

  const delManufc = async (cusName: string) => {
    try {
      await deleteManufc(cusName);
      Message.success('删除成功');
      await fetchData();
    } catch (e: any) {
      Message.error(e.message);
    }
  };

  const handleClick = () => {
    visible.value = true;
  };
  const handleBeforeOk = (done: any) => {
    window.setTimeout(() => {
      addManager();
      fetchData();
      clearForm();
      done();
    }, 300);
  };
  const handleAssetsCancel = () => {
    visible.value = false;
    clearAssertsForm();
  };

  const handleAssetsClick = (record: any) => {
    assetsform.CusName = record.cus_name;
    asvisible.value = true;
  };
  const handleAssetsBeforeOk = (done: any) => {
    window.setTimeout(() => {
      addManufcDomain();
      fetchData();
      clearAssertsForm();
      done();
    }, 300);
  };
  const clearAssertsForm = () => {
    assetsform.CusName = '';
    assetsform.Domain = '';
  };

  const clearForm = () => {
    form.cusName = '';
    form.cusRemark = '';
  };
  const handleCancel = () => {
    visible.value = false;
    clearForm();
  };

  const generateFormModel = () => {
    return {
      searchParams: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  const size = ref<SizeProps>('medium');

  const basePagination: Pagination = {
    page: 1,
    limit: 20,
  };
  const pagination = reactive({
    ...basePagination,
  });
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
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('searchTable.columns.number'),
      dataIndex: 'id',
    },
    {
      title: t('searchTable.columns.name'),
      dataIndex: 'cus_name',
    },
    {
      title: t('searchTable.columns.subdomain'),
      dataIndex: 'cus_subdomain_num',
      slotName: 'cus_subdomain_num',
    },
    {
      title: t('searchTable.columns.port'),
      dataIndex: 'cus_port_num',
    },
    {
      title: t('searchTable.columns.web'),
      dataIndex: 'cus_web_num',
    },
    {
      title: t('searchTable.columns.vul'),
      dataIndex: 'cus_vul_num',
    },
    {
      title: t('searchTable.columns.createdTime'),
      dataIndex: 'cus_time',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const fetchData = async (
    params: Params = { page: 1, limit: 20, searchParams: '' }
  ) => {
    setLoading(true);
    try {
      const data: any = await queryManufcList(params);
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
    fetchData({
      ...basePagination,
      ...formModel.value,
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
    name: 'Manufacturer',
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
