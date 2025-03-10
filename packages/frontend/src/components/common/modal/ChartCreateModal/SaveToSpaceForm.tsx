import { subject } from '@casl/ability';
import { type SpaceSummary } from '@lightdash/common';
import { Button, Select, Stack, TextInput } from '@mantine/core';
import { type UseFormReturnType } from '@mantine/form';
import { IconArrowLeft, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { Can } from '../../../../providers/Ability';
import useApp from '../../../../providers/App/useApp';
import MantineIcon from '../../MantineIcon';
import { type SaveToSpaceFormType } from './types';

type Props<T extends SaveToSpaceFormType> = {
    form: UseFormReturnType<T>;
    isLoading: boolean;
    spaces: SpaceSummary[] | undefined;
    projectUuid?: string;
};

const SaveToSpaceForm = <T extends SaveToSpaceFormType>({
    form,
    isLoading,
    spaces = [],
    projectUuid,
}: Props<T>) => {
    const { user } = useApp();
    const [shouldCreateNewSpace, setShouldCreateNewSpace] = useState(false);
    const isCreatingNewSpace =
        shouldCreateNewSpace || (spaces && spaces.length === 0);

    if (isCreatingNewSpace) {
        return (
            <Stack spacing="xs">
                <TextInput
                    size="xs"
                    label="Space"
                    description="Create a new space to add this chart to"
                    placeholder="eg. KPIs"
                    {...form.getInputProps('newSpaceName')}
                    value={form.values.newSpaceName ?? ''}
                />
                <Button
                    disabled={isLoading}
                    size="xs"
                    variant="default"
                    mr="auto"
                    compact
                    onClick={() => {
                        setShouldCreateNewSpace(false);
                        // @ts-ignore, mantine form is not well typed to support generic + null value setting
                        form.setFieldValue('newSpaceName', null);
                    }}
                    leftIcon={<MantineIcon icon={IconArrowLeft} />}
                >
                    Save to existing space
                </Button>
            </Stack>
        );
    }

    return (
        <Stack spacing="xs">
            <Select
                size="xs"
                searchable
                label="Space"
                description="Select a space to save the chart directly to"
                withinPortal
                data={spaces.map((space) => ({
                    value: space.uuid,
                    label: space.name,
                }))}
                {...form.getInputProps('spaceUuid')}
                required
            />
            <Can
                I="create"
                this={subject('Space', {
                    organizationUuid: user.data?.organizationUuid,
                    projectUuid,
                })}
            >
                <Button
                    disabled={isLoading}
                    size="xs"
                    variant="default"
                    mr="auto"
                    compact
                    leftIcon={<MantineIcon icon={IconPlus} />}
                    onClick={() => setShouldCreateNewSpace(true)}
                >
                    Create new space
                </Button>
            </Can>
        </Stack>
    );
};

export default SaveToSpaceForm;
